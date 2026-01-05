import os
from pdfminer.high_level import extract_text
import openai
import re

def extract_text_from_pdf(pdf_path):
    """
    Extract raw text from a PDF file using pdfminer.six
    """
    try:
        text = extract_text(pdf_path)
        return text.strip()
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return ""

def _scan_keywords(text):
    """Fallback keyword scanner."""
    print("   [Parser] Scanning keywords (Fallback)...")
    lower_text = text.lower()
    common_keywords = [
        "python", "django", "flask", "react", "javascript", "typescript", "node", "aws", 
        "docker", "kubernetes", "sql", "postgresql", "java", "spring", "c++", "go", "html", "css"
    ]
    found_skills = [kw.capitalize() for kw in common_keywords if kw in lower_text]
    experience = 2
    if "senior" in lower_text or "lead" in lower_text: experience = 7
    return { "skills": found_skills, "experience": experience, "education": "Unknown (Offline Mode)" }

def parse_resume_content(text):
    """
    Use OpenAI / DeepSeek or simple rules to parse resume.
    """
    # 1. Check keys
    openai_key = os.environ.get("OPENAI_API_KEY")
    deepseek_key = os.environ.get("DEEPSEEK_API_KEY")

    if deepseek_key:
        print("   [Parser] Using DeepSeek AI...")
        client = openai.OpenAI(api_key=deepseek_key, base_url="https://api.deepseek.com")
        model = "deepseek-chat"
    elif openai_key:
        print("   [Parser] Using OpenAI GPT-4o-mini...")
        client = openai.OpenAI(api_key=openai_key)
        model = "gpt-4o-mini"
    else:
        return _scan_keywords(text)

    # Call AI
    try:
        kwargs = {
            "model": model,
            "messages": [
                {"role": "system", "content": "You are a resume parser. Extract skills (list of strings), experience (years as integer), and education (highest degree as string) from the text. Return VALID JSON only. Do not include markdown formatting. Example: {\"skills\": [\"Python\", \"React\"], \"experience\": 4, \"education\": \"BS CS\"}"},
                {"role": "user", "content": text}
            ],
            "temperature": 0.1
        }
        
        if "gpt" in model:
             kwargs["response_format"] = {"type": "json_object"}
             
        response = client.chat.completions.create(**kwargs)
        
        import json
        content = response.choices[0].message.content
        if "```json" in content:
             content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
             content = content.split("```")[1].strip()
            
        return json.loads(content)
    except Exception as e:
        print(f"   [Parser] AI Error: {e}")
        return _scan_keywords(text)

def passes_screening(applicant, criteria):
    """
    Check if an applicant meets the criteria for a job.
    This was the original legacy function required by views.py.
    """
    if not criteria:
        return True
        
    # Example logic (checking experience)
    if criteria.min_experience and applicant.experience:
        if applicant.experience < criteria.min_experience:
            return False
            
    # Example logic (checking skills overlap)
    # criteria.required_skills is a text field like "Python, Django"
    if criteria.required_skills and applicant.skills:
        req_skills = [s.strip().lower() for s in criteria.required_skills.split(',')]
        app_skills = [s.strip().lower() for s in applicant.skills.split(',')]
        
        # Check if at least one required skill is present
        has_skill = any(s in app_skills for s in req_skills)
        if not has_skill:
            return False
            
    return True

def _calculate_education_score(candidate_edu_str, job_req_str):
    """
    Compares candidate education vs job requirements.
    Returns a score from 0 to 100 based on the match.
    """
    # 1. Define Hierarchy
    EDU_RANK = {
        'phd': 5,
        'doctorate': 5,
        'master': 4,
        'mba': 4,
        'bachelor': 3,
        'bs': 3,
        'ba': 3,
        'associate': 2,
        'diploma': 1,
        'high school': 0,
        'none': 0
    }
    
    # 2. Normalize inputs to lowercase
    cand_edu_lower = str(candidate_edu_str).lower()
    job_req_lower = str(job_req_str).lower()
    
    # 3. Find highest rank for Candidate
    cand_rank = 0
    for key, rank in EDU_RANK.items():
        if key in cand_edu_lower:
            cand_rank = max(cand_rank, rank)
            
    # 4. Find highest rank for Job (Default to Bachelors/Rank 3 if not specified)
    job_rank = 3 
    found_req = False
    for key, rank in EDU_RANK.items():
        if key in job_req_lower:
            job_rank = max(job_rank, rank)
            found_req = True
            
    # If job creates no education requirement, be lenient
    if not found_req:
        return 100

    # 5. Compare
    if cand_rank >= job_rank:
        return 100  # Perfect match or overqualified
    elif cand_rank == job_rank - 1:
        return 50   # One step below (e.g. Associate instead of Bachelors)
    else:
        return 0    # Not close enough




def _get_ai_match_score(resume_text, job_description):
    """
    Asks AI to score the relevance of the resume against the job description.
    Returns integer 0-100.
    """
    openai_key = os.environ.get("OPENAI_API_KEY")
    deepseek_key = os.environ.get("DEEPSEEK_API_KEY")

    if deepseek_key:
        client = openai.OpenAI(api_key=deepseek_key, base_url="https://api.deepseek.com")
        model = "deepseek-chat"
    elif openai_key:
        client = openai.OpenAI(api_key=openai_key)
        model = "gpt-4o-mini"
    else:
        # Fallback if no API key
        return 50 

    try:
        completion = client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "system", 
                    "content": "You are a recruiter. Compare the Resume vs Job Description. Provide a 'Relevance Score' from 0-100 based on core skills, industry fit, and seniority. Return ONLY the integer number."
                },
                {
                    "role": "user", 
                    "content": f"JOB:\n{job_description[:2000]}\n\nRESUME:\n{resume_text[:2000]}"
                }
            ],
            temperature=0.0
        )
        content = completion.choices[0].message.content.strip()
        # Extract digits just in case
        import re
        match = re.search(r'\d+', content)
        if match:
            return int(match.group(0))
        return 50
    except Exception as e:
        print(f"   [Scoring] AI Error: {e}")
        return 50







def calculate_application_score(application, return_details=False):
    """
    Calculates a match score (0-100) based on:
    1. Skills Match (40%)
    2. Experience Match (30%)
    3. Education Match (15%)
    4. AI Relevance Check (15%)
    """
    score = 0
    details = {}
    
    # --- 1. Skills Match (40%) --- (Reduced from 50%)
    job_skills_text = (application.job.requirements or "").lower()
    candidate_skills_text = (application.applicant.skills or "").lower()
    
    job_skills = set(re.split(r'[,\n\r]+', job_skills_text))
    candidate_skills = set(re.split(r'[,\n\r]+', candidate_skills_text))
    # Cleanup empty strings
    job_skills = {s.strip() for s in job_skills if s.strip()}
    candidate_skills = {s.strip() for s in candidate_skills if s.strip()}
    
    skills_score = 0
    matches = set()
    if job_skills:
        matches = job_skills.intersection(candidate_skills)
        match_ratio = len(matches) / len(job_skills)
        skills_score = match_ratio * 40
        score += skills_score
        print(f"   [Scoring] Skills: {len(matches)}/{len(job_skills)} -> +{skills_score:.1f} pts")
    
    details['skills_score'] = round(skills_score, 1)
    details['matching_skills'] = list(matches)

    # --- 2. Experience Match (30%) --- (Unchanged)
    min_exp = 0
    match = re.search(r'(\d+)\+?\s*years?', application.job.requirements or "", re.IGNORECASE)
    if match:
        min_exp = int(match.group(1))
    
    cand_exp = application.applicant.experience or 0
    exp_score = 0
    
    if min_exp > 0:
        exp_ratio = min(cand_exp / min_exp, 1.5)
        points = min(exp_ratio, 1.0) * 30
        exp_score = points
        score += points
        print(f"   [Scoring] Experience: {cand_exp}/{min_exp}yr -> +{exp_score:.1f} pts")
    elif cand_exp > 0:
        exp_score = 10 
        score += 10 # Bonus if no specific requirement but has exp
    
    details['experience_score'] = round(exp_score, 1)

    # --- 3. Education Match (15%) --- (NEW)
    parsed_data = application.applicant.parsed_data or {}
    cand_edu = str(parsed_data.get('education', "") or application.applicant.education or "None")
    
    # Look for education keywords in job requirements
    edu_score_val = _calculate_education_score(cand_edu, application.job.requirements or "")
    weighted_edu_score = edu_score_val * 0.15
    score += weighted_edu_score
    print(f"   [Scoring] Education: {cand_edu} -> +{weighted_edu_score:.1f} pts")
    
    details['education_score'] = round(weighted_edu_score, 1)

    # --- 4. AI Relevance Check (15%) --- (NEW)
    # We construct a resume summary string
    resume_summary = f"Skills: {candidate_skills_text}. Experience: {cand_exp} years. Education: {cand_edu}."
    ai_raw_score = _get_ai_match_score(resume_summary, application.job.description or "")
    
    ai_weighted_score = ai_raw_score * 0.15
    score += ai_weighted_score
    print(f"   [Scoring] AI Vibe Check: {ai_raw_score}/100 -> +{ai_weighted_score:.1f} pts")
    
    details['ai_score'] = round(ai_weighted_score, 1)

    # Finalize
    final_score = round(score, 1)
    application.score = final_score
    application.save()
    
    if return_details:
        details['total_score'] = final_score
        return details
        
    return final_score

# def calculate_application_score(application, return_details=False):
#     """
#     Calculates a match score (0-100) for an application based on:
#     1. Skills Match (50%)
#     2. Experience Match (30%)
#     3. Keyword/Description Match (20%)
#     """
#     score = 0
#     details = {}
    
#     # --- 1. Skills Match (50%) ---
#     job_skills_text = (application.job.requirements or "").lower()
#     candidate_skills_text = (application.applicant.skills or "").lower()
    
#     job_skills = set(re.split(r'[,\n\r]+', job_skills_text))
#     candidate_skills = set(re.split(r'[,\n\r]+', candidate_skills_text))
    
#     job_skills = {s.strip() for s in job_skills if s.strip()}
#     candidate_skills = {s.strip() for s in candidate_skills if s.strip()}
    
#     skills_score = 0
#     matches = set()
#     if job_skills:
#         matches = job_skills.intersection(candidate_skills)
#         match_ratio = len(matches) / len(job_skills)
#         skills_score = match_ratio * 50
#         score += skills_score
#         print(f"   [Scoring] Skills Match: {len(matches)}/{len(job_skills)} ({match_ratio*100:.1f}%) -> +{skills_score:.1f} pts")
#     else:
#         print("   [Scoring] No job skills found to match against.")
    
#     details['skills_score'] = round(skills_score, 1)
#     details['matching_skills'] = list(matches)
#     details['missing_skills'] = list(job_skills - matches) if job_skills else []

#     # --- 2. Experience Match (30%) ---
#     min_exp = 0
#     match = re.search(r'(\d+)\+?\s*years?', application.job.requirements or "", re.IGNORECASE)
#     if match:
#         min_exp = int(match.group(1))
    
#     cand_exp = application.applicant.experience or 0
#     exp_score = 0
    
#     if min_exp > 0:
#         exp_ratio = min(cand_exp / min_exp, 1.5)
#         points = min(exp_ratio, 1.0) * 30
#         exp_score = points
#         score += points
#         print(f"   [Scoring] Experience: {cand_exp} / {min_exp} required -> +{points:.1f} pts")
#     else:
#         if cand_exp > 0:
#              exp_score = 10
#              score += 10
#         else:
#              score += 0
    
#     details['experience_score'] = round(exp_score, 1)
#     details['required_experience'] = min_exp
#     details['candidate_experience'] = cand_exp

#     # --- 3. Description/Resumé Text Similarity (20%) ---
#     job_desc_words = set(re.findall(r'\w+', (application.job.description or "").lower()))
#     parsed_resume_text = str(application.applicant.parsed_data).lower()
#     resume_words = set(re.findall(r'\w+', parsed_resume_text))
    
#     text_score = 0
#     if job_desc_words:
#         common_words = job_desc_words.intersection(resume_words)
#         text_match_ratio = len(common_words) / len(job_desc_words)
#         boosted_ratio = min(text_match_ratio * 5, 1.0) 
#         text_score = boosted_ratio * 20
#         score += text_score
#         print(f"   [Scoring] Keyword Match: {len(common_words)} common words -> +{text_score:.1f} pts")

#     details['text_match_score'] = round(text_score, 1)

#     final_score = round(score, 1)
#     application.score = final_score
#     application.save()
    
#     if return_details:
#         details['total_score'] = final_score
#         return details
        
#     return final_score