import pickle
import re
import docx
import PyPDF2
from werkzeug.utils import secure_filename
import joblib
import spacy

# Import spacy and load the model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Downloading en_core_web_sm model for spaCy...")
    spacy.cli.download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

# Load ML models using joblib
try:
    resume_pipeline = joblib.load("resume_pipeline.pkl")
    le = joblib.load("label_encoder.pkl")
except FileNotFoundError:
    print("Error: ML model files (resume_pipeline.pkl, label_encoder.pkl) not found.")
    print("Please ensure these files are in the same directory as the main app.")
    exit()
except Exception as e:
    print(f"Error loading model files: {e}")
    print("Please check if the files are valid and compatible with your scikit-learn version.")
    exit()


def clean_resume(txt):
    txt = re.sub(r'http\S+\s', ' ', txt)
    txt = re.sub('RT|cc', ' ', txt)
    txt = re.sub(r'#\S+\s', ' ', txt)
    txt = re.sub(r'[^\x00-\x7f]', ' ', txt)
    txt = re.sub(r'@\S+', ' ', txt)
    txt = re.sub(r'[!"#$%&\'()*+,-./:;<=>?@[\]^_`{|}~]', ' ', txt)
    txt = re.sub(r'\s+', ' ', txt)
    return txt


def extract_text(file):
    filename = secure_filename(file.filename)
    ext = filename.split(".")[-1].lower()
    if ext == "pdf":
        reader = PyPDF2.PdfReader(file)
        return ''.join([p.extract_text() for p in reader.pages if p.extract_text()])
    elif ext == "docx":
        doc = docx.Document(file)
        return '\n'.join([p.text for p in doc.paragraphs])
    elif ext == "txt":
        return file.read().decode("utf-8", errors="ignore")
    else:
        raise ValueError("Unsupported file format. Please upload PDF, DOCX, or TXT.")


def extract_resume_details(text):
    doc = nlp(text)
    text_lower = text.lower()

    skills_keywords = [
        "python", "java", "c++", "sql", "html", "css", "javascript",
        "react", "node", "mern", "ds", "ml", "nlp", "mongodb",
        "django", "flask", "aws", "azure", "gcp", "docker", "kubernetes",
        "git", "linux", "agile", "scrum", "restful api", "machine learning",
        "data analysis", "artificial intelligence", "web development",
        "mobile development", "android", "ios", "swift", "kotlin", "typescript",
        "angular", "vue", "php", "c#", ".net", "spring", "hibernate",
        "tableau", "power bi", "excel", "r", "sas", "matlab", "spark", "hadoop",
        "jira", "confluence", "terraform", "ansible", "jenkins", "cicd",
        "pmp", "cism", "cissp", "network security", "cybersecurity", "blockchain",
        "figma", "photoshop", "illustrator", "ui/ux", "wireframing", "prototyping",
        "microsoft office", "google suite", "jira", "confluence", "trello",
        "salesforce", "sap", "erp", "crm"
    ]

    skills_found = set()
    for skill in skills_keywords:
        if re.search(r'\b' + re.escape(skill) + r'\b', text_lower):
            skills_found.add(skill.upper())

    education = []
    edu_patterns = [
        r"(?:b\.?s\.?|m\.?s\.?|ph\.?d\.?|bachelor(?:'s)?|master(?:'s)?|doctorate)?\s+in\s+[\w\s]+\s+from\s+[\w\s,.]+(?:\s+graduated|\s+class\s+of|\s+\d{4})?",
        r"(?:b\.?tech|m\.?tech|b\.?e|m\.?e|bachelor|master|msc|bsc|engineering)\s+in\s+[\w\s]+(?:,\s+[\w\s]+)?,\s*[\w\s,.]+(?:\s+university|\s+college|\s+institute)?(?:\s+\d{4})?",
        r"[\w\s,.]+(?:university|college|institute|polytechnic)\s+-\s+(?:b\.?s\.?|m\.?s\.?|ph\.?d\.?|bachelor(?:'s)?|master(?:'s)?|doctorate)?\s+in\s+[\w\s]+(?:\s+\d{4})?",
        r"(?:(?:graduate|postgraduate)\s+diploma|certificate)\s+in\s+[\w\s]+(?:\s+from\s+[\w\s,.]+)?(?:\s+\d{4})?"
    ]
    
    for sent in doc.sents:
        sent_lower = sent.text.lower()
        if any(re.search(pattern, sent_lower, re.IGNORECASE) for pattern in edu_patterns):
            education.append(sent.text.strip())
            break
    if not education:
        for ent in doc.ents:
            if ent.label_ == "ORG" and ("university" in ent.text.lower() or "college" in ent.text.lower() or "institute" in ent.text.lower()):
                education.append(ent.text.strip())
                break

    education_output = education[0] if education else "Not Found (Try including your degree, major, and university name clearly)"

    experience_years_list = []
    matches_years = re.findall(r'(\d+(?:\.\d+)?)\+?\s*(?:year(?:s)?|yr(?:s)?)\b', text_lower)
    if matches_years:
        experience_years_list.extend([float(m) for m in matches_years])
    
    matches_date_ranges = re.findall(r'(\d{4})\s*[-–]\s*(?:present|current|\d{4})', text_lower)
    if matches_date_ranges:
        current_year = 2025
        for start_year_str in matches_date_ranges:
            try:
                start_year = int(start_year_str)
                if "present" in text_lower or "current" in text_lower:
                     experience_years_list.append(current_year - start_year)
                else:
                    end_year_match = re.search(rf'{start_year_str}\s*[-–]\s*(\d{{4}})', text_lower)
                    if end_year_match:
                        end_year = int(end_year_match.group(1))
                        experience_years_list.append(end_year - start_year)
                    else:
                        experience_years_list.append(current_year - start_year)
            except ValueError:
                pass

    total_experience = 0
    if experience_years_list:
        total_experience = sum(experience_years_list)
        if total_experience < 1.0:
            experience = "Less than 1 Year"
        else:
            experience = f"{round(total_experience, 1)} Years"
    else:
        experience = "Not Found (Ensure you list your work experience with clear start and end dates or total years.)"

    ats_score = 40
    if "experience" in text_lower or total_experience > 0: ats_score += 15
    if "skills" in text_lower or skills_found: ats_score += 15
    if "education" in text_lower or education_output != "Not Found (Try including your degree, major, and university name clearly)": ats_score += 10
    if "project" in text_lower or "portfolio" in text_lower: ats_score += 5
    if "certifications" in text_lower or "licenses" in text_lower: ats_score += 5
    if "achievements" in text_lower or "accomplishments" in text_lower or "awards" in text_lower: ats_score += 5
    if "summary" in text_lower or "objective" in text_lower: ats_score += 3
    if "leadership" in text_lower or "management" in text_lower: ats_score += 2
    ats_score = min(ats_score, 100)

    recommendations = []
    if not skills_found:
        recommendations.append("Ensure your key technical skills are clearly listed and align with target jobs.")
    if total_experience == 0:
        recommendations.append("Add detailed work experience with clear start and end dates for each role.")
    else:
        if not re.search(r'\d+%|\$|\d+x|increased|decreased|improved|reduced|managed (over|more than) \d+', text_lower):
             recommendations.append("Quantify your work experience with numbers and metrics (e.g., 'Increased sales by 15%', 'Managed a team of 5').")
    if education_output == "Not Found (Try including your degree, major, and university name clearly)":
        recommendations.append("Clearly state your degree, major/field of study, and the full name of your university/college.")
    if "certifications" not in text_lower and "licenses" not in text_lower:
        recommendations.append("Consider adding a 'Certifications' or 'Licenses' section to highlight professional credentials.")
    if "portfolio" not in text_lower and "github" not in text_lower and "linkedin" not in text_lower:
        recommendations.append("Include links to your online portfolio, GitHub, or LinkedIn profile for demonstrable work.")
    if "project" not in text_lower and "projects" not in text_lower:
        recommendations.append("Add a 'Projects' section to showcase personal or academic work relevant to your target roles.")
    if len(recommendations) < 3:
        if "tailor your resume" not in " ".join(recommendations).lower():
            recommendations.append("Tailor your resume content with keywords from the job descriptions you apply for.")
        if "proofread" not in " ".join(recommendations).lower():
            recommendations.append("Proofread your resume carefully for any typos or grammatical errors.")
        if "concise" not in " ".join(recommendations).lower():
            recommendations.append("Keep your resume concise and relevant, ideally one page for less than 10 years experience.")
    
    recommendations = list(set(recommendations))

    return {
        "skills": sorted(list(skills_found)) or ["N/A"],
        "education": education_output,
        "experience": experience,
        "ats_score": f"{ats_score}%",
        "recommendations": recommendations
    }