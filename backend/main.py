import os
import base64
import json
import re
import io
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from groq import Groq
import groq as groq_module
import httpx
from dotenv import load_dotenv
import PyPDF2

load_dotenv()

app = FastAPI(title="Vitalytics API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "https://medical-report-analyser-psi.vercel.app",  # ✅ Vercel production URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = os.getenv("GROQ_API_KEY", "")
DEMO_MODE = not API_KEY or API_KEY == "your_groq_api_key_here"

client = Groq(api_key=API_KEY, http_client=httpx.Client(verify=False)) if not DEMO_MODE else None

# Models — verify at console.groq.com/playground if you get a model-not-found error
TEXT_MODEL = "llama-3.3-70b-versatile"
VISION_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct"

# ---------------------------------------------------------------------------
# Demo responses (used when no API key is configured)
# ---------------------------------------------------------------------------

DEMO_REPORT = {
    "report_title": "Complete Blood Count (CBC) with Differential",
    "patient_info": {
        "name": "Demo Patient",
        "age": "32",
        "gender": "Female",
        "report_date": "2025-06-09",
        "doctor": "Dr. Priya Sharma",
        "lab": "Apollo Diagnostics"
    },
    "overall_health_score": "Needs Attention",
    "overall_health_color": "orange",
    "summary": "Your blood test shows mostly normal results, but there are two findings that need attention — your hemoglobin is slightly low (mild anaemia) and your blood glucose is on the higher side of normal. Everything else, including your white blood cells, platelets, and kidney/liver markers, looks healthy.",
    "key_findings": [
        {"parameter": "Hemoglobin", "value": "10.8 g/dL", "normal_range": "12.0–16.0 g/dL", "status": "Low", "simple_explanation": "The protein that carries oxygen in your blood is below normal — you may feel tired"},
        {"parameter": "Blood Glucose (Fasting)", "value": "108 mg/dL", "normal_range": "70–100 mg/dL", "status": "High", "simple_explanation": "Your blood sugar is slightly above the normal fasting range"},
        {"parameter": "WBC Count", "value": "7,200 /µL", "normal_range": "4,000–11,000 /µL", "status": "Normal", "simple_explanation": "Your infection-fighting white blood cells are at a healthy level"},
        {"parameter": "Platelets", "value": "2,45,000 /µL", "normal_range": "1,50,000–4,00,000 /µL", "status": "Normal", "simple_explanation": "Your blood clotting cells are perfectly normal"},
        {"parameter": "Serum Creatinine", "value": "0.8 mg/dL", "normal_range": "0.5–1.1 mg/dL", "status": "Normal", "simple_explanation": "Your kidneys are filtering waste properly"},
        {"parameter": "SGPT (ALT)", "value": "28 U/L", "normal_range": "7–40 U/L", "status": "Normal", "simple_explanation": "Your liver enzymes are within the healthy range"},
        {"parameter": "TSH", "value": "3.2 mIU/L", "normal_range": "0.4–4.0 mIU/L", "status": "Normal", "simple_explanation": "Your thyroid gland is working normally"},
        {"parameter": "Vitamin D", "value": "18 ng/mL", "normal_range": "30–100 ng/mL", "status": "Low", "simple_explanation": "Your Vitamin D level is insufficient — very common in India"}
    ],
    "abnormal_findings": [
        {
            "finding": "Mild Anaemia (Low Hemoglobin)",
            "your_value": "10.8 g/dL",
            "what_is_normal": "12.0–16.0 g/dL for adult women",
            "severity": "Mild",
            "plain_explanation": "Your blood doesn't have enough haemoglobin, the protein that carries oxygen to your organs. Think of it like having fewer delivery trucks carrying oxygen around your body.",
            "why_it_matters": "This can cause fatigue, weakness, headaches, and shortness of breath during activity. Left untreated, it can strain your heart.",
            "common_causes": ["Iron deficiency (most common cause in women)", "Low dietary iron intake", "Heavy menstrual periods", "Vitamin B12 or folate deficiency"]
        },
        {
            "finding": "Pre-diabetic Blood Sugar",
            "your_value": "108 mg/dL (fasting)",
            "what_is_normal": "Below 100 mg/dL (fasting)",
            "severity": "Mild",
            "plain_explanation": "Your blood sugar after fasting overnight is slightly higher than ideal. You're in the 'pre-diabetic' range — not diabetic yet, but a yellow flag worth addressing now.",
            "why_it_matters": "Without lifestyle changes, pre-diabetes can progress to Type 2 Diabetes within 5–10 years. The good news: it's very reversible at this stage.",
            "common_causes": ["Sedentary lifestyle", "High-carbohydrate diet", "Family history of diabetes", "Stress and poor sleep"]
        },
        {
            "finding": "Vitamin D Deficiency",
            "your_value": "18 ng/mL",
            "what_is_normal": "30–100 ng/mL",
            "severity": "Moderate",
            "plain_explanation": "Your Vitamin D is too low. This is extremely common in India — ironically, despite abundant sunshine, most urban Indians are deficient because we stay indoors.",
            "why_it_matters": "Vitamin D is critical for bone strength, immunity, mood, and muscle function. Deficiency is linked to fatigue, bone pain, and increased infection risk.",
            "common_causes": ["Insufficient sun exposure", "Indoor lifestyle", "Dark skin pigmentation (requires more sun exposure)", "Low dietary intake"]
        }
    ],
    "normal_findings": [
        {"parameter": "WBC Count", "value": "7,200 /µL", "note": "Great — your immune system is working well"},
        {"parameter": "Platelets", "value": "2,45,000 /µL", "note": "Perfect clotting ability"},
        {"parameter": "Kidney Function (Creatinine)", "value": "0.8 mg/dL", "note": "Kidneys are healthy and filtering properly"},
        {"parameter": "Liver Function (SGPT)", "value": "28 U/L", "note": "Liver is in excellent shape"},
        {"parameter": "Thyroid (TSH)", "value": "3.2 mIU/L", "note": "Thyroid is functioning normally"}
    ],
    "future_health_concerns": [
        {
            "concern": "Type 2 Diabetes Risk",
            "risk_level": "Moderate",
            "timeline": "medium-term (months-year)",
            "explanation": "With a fasting glucose of 108, you're in pre-diabetic territory. Without changes, this could progress to full diabetes.",
            "prevention": "Walk 30 minutes daily, reduce white rice/bread/sugar, increase vegetables and protein. This is highly reversible right now."
        },
        {
            "concern": "Worsening Anaemia",
            "risk_level": "Low",
            "timeline": "short-term (weeks-months)",
            "explanation": "If the cause of low haemoglobin isn't treated, it could drop further and cause more significant symptoms.",
            "prevention": "Iron-rich foods (spinach, lentils, red meat), Vitamin C with meals to help iron absorption, and follow-up blood test in 3 months."
        },
        {
            "concern": "Bone Density Loss",
            "risk_level": "Low",
            "timeline": "long-term (years)",
            "explanation": "Prolonged Vitamin D deficiency can weaken bones over time, increasing fracture risk later in life.",
            "prevention": "Vitamin D3 supplement (usually 60,000 IU weekly for 8 weeks, then maintenance dose — ask your doctor), and 15 min of morning sunlight daily."
        }
    ],
    "recommendations": [
        {"action": "Get an Iron Studies panel and Serum Ferritin test", "priority": "Soon — Within 2 weeks", "details": "This will determine if your anaemia is caused by iron deficiency (most likely) and help your doctor prescribe the right treatment."},
        {"action": "Start Vitamin D3 supplementation", "priority": "Soon — Within 2 weeks", "details": "Ask your doctor for a Vitamin D3 supplement. A common prescription is 60,000 IU once a week for 8–12 weeks."},
        {"action": "Repeat fasting blood glucose in 3 months", "priority": "Routine — Within 3 months", "details": "After making dietary changes, recheck your fasting sugar to see if it has come down below 100."},
        {"action": "Consult your doctor about the anaemia findings", "priority": "Soon — Within 2 weeks", "details": "Your doctor may recommend iron supplements or investigate whether heavy periods or another cause is contributing."}
    ],
    "lifestyle_improvements": [
        {"category": "Diet", "tip": "Eat iron-rich foods daily: spinach, lentils (dal), rajma, methi, jaggery, and sesame seeds", "impact": "Will directly help raise your haemoglobin over 4–8 weeks"},
        {"category": "Diet", "tip": "Reduce white rice, maida, and sugary drinks. Replace with millets (bajra, jowar) and whole grains", "impact": "Will help bring your fasting blood sugar back into the normal range"},
        {"category": "Exercise", "tip": "Walk briskly for 30 minutes every day, ideally in morning sunlight", "impact": "Improves insulin sensitivity (lowers blood sugar) AND gives you Vitamin D from sunlight"},
        {"category": "Supplements", "tip": "Take Vitamin C (amla/lemon juice) alongside iron-rich meals", "impact": "Vitamin C doubles the absorption of iron from plant sources"},
        {"category": "Sleep", "tip": "Aim for 7–8 hours of sleep. Poor sleep directly raises blood sugar levels", "impact": "Good sleep can reduce fasting glucose by 10–15 mg/dL"},
        {"category": "Hydration", "tip": "Drink 8–10 glasses of water daily and reduce tea/coffee around meal times", "impact": "Tea and coffee reduce iron absorption when consumed with meals"}
    ],
    "questions_for_doctor": [
        "Is my anaemia caused by iron deficiency, or could it be B12 or folate deficiency?",
        "Should I take iron supplements, and if so, which kind and for how long?",
        "My fasting sugar is 108 — what HbA1c test should I do to get a 3-month picture?",
        "What Vitamin D3 dose do you recommend for my current level of 18 ng/mL?",
        "Given my sugar levels, should I see an endocrinologist or is lifestyle change enough for now?"
    ],
    "medications_mentioned": [],
    "next_steps": [
        "Book an appointment with your doctor within the next 2 weeks to discuss the anaemia and blood sugar findings",
        "Get Iron Studies (Serum Ferritin, Serum Iron, TIBC) and HbA1c tests done",
        "Start 30 minutes of daily walking immediately — it helps both the blood sugar and overall energy",
        "Begin eating iron-rich foods and reduce sugary/refined carbohydrate intake",
        "Ask your doctor to prescribe Vitamin D3 supplementation",
        "Recheck CBC and fasting glucose in 3 months to track improvement"
    ],
    "disclaimer": "This is a DEMO analysis with sample data — no real file was processed. In production mode (with a Groq API key), your actual uploaded report will be analyzed by Llama AI. This is for educational purposes only and does not replace professional medical advice."
}

DEMO_IMAGE = {
    "image_type": "X-Ray",
    "body_region": "Chest (Posteroanterior view)",
    "image_quality": "Good",
    "overall_impression": "Mild Abnormality",
    "impression_color": "yellow",
    "summary": "Your chest X-ray shows mostly normal lungs and heart, but there is a mild increased opacity in the lower right lung area that could indicate early pneumonia or fluid. Your heart size appears normal and the major airways look clear.",
    "what_we_see": [
        "Both lungs visible with normal overall expansion",
        "Heart appears normal in size and position",
        "Ribs and bony structures look intact with no fractures",
        "Trachea (main airway) is centrally positioned — normal",
        "A subtle haziness in the lower right lung zone",
        "Left lung appears completely clear"
    ],
    "normal_findings": [
        {"structure": "Heart", "observation": "Normal size — heart occupies less than 50% of chest width", "why_good": "No signs of heart enlargement or failure"},
        {"structure": "Left Lung", "observation": "Completely clear throughout all zones", "why_good": "No infection, fluid, or collapse on the left side"},
        {"structure": "Bones (Ribs, Clavicles)", "observation": "All ribs intact, no fractures seen", "why_good": "No trauma or bone disease visible"},
        {"structure": "Trachea & Main Bronchi", "observation": "Midline, not deviated", "why_good": "No mass or pressure pushing the airway to one side"}
    ],
    "abnormal_findings": [
        {
            "finding": "Right Lower Lobe Opacity",
            "location": "Lower zone of the right lung",
            "severity": "Mild",
            "plain_explanation": "There's a faint white patch in the lower-right part of your lung. On an X-ray, healthy air-filled lungs appear dark/black, so this whitish area means something is filling that space — could be infection (pneumonia), mucus, or a small amount of fluid.",
            "why_it_matters": "If this is early pneumonia, it needs antibiotic treatment. If left untreated, it can worsen and spread.",
            "confidence": "Moderate — note that AI image analysis has limitations and a radiologist must review"
        }
    ],
    "future_concerns": [
        {
            "concern": "Possible early-stage Pneumonia",
            "explanation": "The opacity pattern is consistent with bacterial or viral pneumonia in the early stages. This requires prompt medical attention.",
            "monitoring": "A clinical examination with stethoscope and possibly a repeat X-ray in 4–6 weeks after treatment to confirm resolution"
        }
    ],
    "recommendations": [
        {"action": "See a doctor today or tomorrow", "priority": "Urgent — See doctor immediately", "details": "The right lower lobe finding needs clinical correlation — your doctor will listen to your lungs and decide if antibiotics are needed."},
        {"action": "Get a sputum culture if you have a productive cough", "priority": "Soon — Within 2 weeks", "details": "This identifies the exact bacteria causing the infection and helps choose the right antibiotic."},
        {"action": "Repeat chest X-ray after treatment", "priority": "Routine — Within 3 months", "details": "A follow-up X-ray 4–6 weeks after completing treatment confirms the lung has fully cleared."}
    ],
    "follow_up_tests": [
        {"test": "Complete Blood Count (CBC)", "reason": "High WBC count would confirm active infection/inflammation"},
        {"test": "C-Reactive Protein (CRP)", "reason": "Elevated CRP confirms pneumonia or other inflammatory process"},
        {"test": "Sputum Culture & Sensitivity", "reason": "Identifies the exact bacteria and which antibiotic will work best"},
        {"test": "Repeat Chest X-Ray (after treatment)", "reason": "Confirms the lung has completely cleared after antibiotic course"}
    ],
    "questions_for_doctor": [
        "Does the right lower lobe finding look like pneumonia to you after examining me?",
        "Do I need antibiotics right now, or can we wait and watch?",
        "Should I get a CT scan of the chest for a clearer picture?",
        "How long before I should feel better if it is pneumonia?",
        "When should I come back for a follow-up X-ray?"
    ],
    "important_notes": [
        "This is a DEMO analysis with sample data — no real image was processed",
        "AI image analysis has significant limitations and must always be reviewed by a qualified radiologist",
        "Clinical symptoms (fever, cough, breathlessness) are just as important as the X-ray findings",
        "In production mode (with a Groq API key), your actual uploaded image will be analyzed by Llama AI"
    ],
    "disclaimer": "Medical image analysis by AI has significant limitations. This analysis is for informational purposes only. A qualified radiologist and your treating physician must review all imaging for official diagnosis and treatment planning."
}

def demo_specialist(disease: str, city: str) -> dict:
    return {
        "condition": disease,
        "city": city,
        "overview": f"Managing {disease} effectively starts with finding the right specialist. In {city}, you have access to excellent healthcare facilities. A specialist can create a personalized treatment plan, monitor your progress, and help prevent complications before they arise.",
        "specialist_types": [
            {
                "type": f"{'Endocrinologist' if 'diabet' in disease.lower() or 'thyroid' in disease.lower() else 'Internal Medicine Specialist'}",
                "role": f"Primary specialist for {disease} — manages diagnosis, medication, and long-term monitoring",
                "when_to_see": "First visit: within 2 weeks of diagnosis or if symptoms are worsening"
            },
            {
                "type": "General Physician / Family Doctor",
                "role": "Your first point of contact — coordinates your overall care and refers you to specialists",
                "when_to_see": "Start here if you haven't seen a specialist yet — they'll run initial tests and refer you"
            },
            {
                "type": "Nutritionist / Dietitian",
                "role": f"Creates a personalised diet plan to manage {disease} through food — often as effective as medication for early-stage conditions",
                "when_to_see": "As soon as possible — dietary changes show results within 4–8 weeks"
            },
            {
                "type": "Physiotherapist / Exercise Specialist",
                "role": f"Prescribes safe, targeted exercise to manage {disease} and improve quality of life",
                "when_to_see": "After your first specialist consultation — they'll clear you for exercise"
            }
        ],
        "questions_to_ask": [
            f"What stage or severity is my {disease}, and what does that mean for my treatment?",
            "What lifestyle changes will make the biggest difference?",
            "How often should I get tested/monitored?",
            "Are there any warning signs I should watch for at home?",
            "What medications are available, and what are their side effects?",
            "Are there any clinical trials or newer treatments I should know about?"
        ],
        "what_to_bring": [
            "All recent blood test reports and medical reports",
            "List of current medications (with dosage and frequency)",
            "List of all symptoms and when they started",
            "Family medical history (especially parents/siblings with same condition)",
            "Health insurance card / Aadhar card for registration",
            "Previous consultation notes or discharge summaries"
        ],
        "where_to_find": [
            {
                "name": "Practo",
                "description": f"India's largest doctor discovery platform — find verified {disease} specialists in {city} with reviews and instant booking",
                "search_tip": f"Search '{disease} specialist in {city}' on Practo to filter by rating, experience, and fees",
                "url": "https://practo.com"
            },
            {
                "name": "Apollo Hospitals",
                "description": f"Apollo has hospitals in most major Indian cities with dedicated {disease} clinics and experienced specialists",
                "search_tip": f"Visit Apollo's website and search by speciality and {city} location",
                "url": "https://apollohospitals.com"
            },
            {
                "name": "1mg",
                "description": "Book lab tests and doctor consultations online — also offers teleconsultation for a quick first opinion",
                "search_tip": f"Use 1mg's 'Consult a Doctor' feature for a quick online consultation before visiting in {city}",
                "url": "https://1mg.com"
            },
            {
                "name": "JustDial / Google Maps",
                "description": f"Search '{disease} specialist near me' or '{disease} doctor in {city}' for local clinic listings with phone numbers and directions",
                "search_tip": f"Type '{disease} specialist {city}' in Google Maps to see clinics near you with ratings",
                "url": None
            }
        ],
        "urgency": "Moderate",
        "urgency_timeframe": "Within 1-2 weeks",
        "urgency_explanation": f"While {disease} typically isn't a same-day emergency, delaying specialist care beyond 2 weeks can allow the condition to progress. Book an appointment soon — early intervention leads to significantly better outcomes."
    }


# ---------------------------------------------------------------------------
# Prompts
# ---------------------------------------------------------------------------

REPORT_PROMPT = """You are a compassionate and expert medical report interpreter. Analyze this medical report and return a JSON response that helps patients understand their health.

IMPORTANT: Return ONLY valid JSON, no markdown, no explanation outside the JSON.

Return this exact JSON structure:
{
  "report_title": "name/type of this report",
  "patient_info": {
    "name": "patient name or 'Not specified'",
    "age": "age or 'Not specified'",
    "gender": "gender or 'Not specified'",
    "report_date": "date or 'Not specified'",
    "doctor": "ordering doctor or 'Not specified'",
    "lab": "laboratory/hospital name or 'Not specified'"
  },
  "overall_health_score": "Excellent|Good|Fair|Needs Attention|Critical",
  "overall_health_color": "green|green|yellow|orange|red",
  "summary": "2-3 sentence plain English summary of what this report shows overall. Write as if explaining to someone with no medical background.",
  "key_findings": [
    {
      "parameter": "test name",
      "value": "measured value with units",
      "normal_range": "normal range or 'N/A'",
      "status": "Normal|High|Low|Abnormal|Borderline",
      "simple_explanation": "what this means in one simple sentence"
    }
  ],
  "abnormal_findings": [
    {
      "finding": "name of the abnormal finding",
      "your_value": "what was found in you",
      "what_is_normal": "what is considered normal",
      "severity": "Mild|Moderate|Severe",
      "plain_explanation": "explain this simply as if to a friend — no jargon",
      "why_it_matters": "why this is important for your health",
      "common_causes": ["possible reason 1", "possible reason 2", "possible reason 3"]
    }
  ],
  "normal_findings": [
    {
      "parameter": "test name",
      "value": "value",
      "note": "brief positive note"
    }
  ],
  "future_health_concerns": [
    {
      "concern": "name of potential future health risk",
      "risk_level": "Low|Moderate|High",
      "timeline": "short-term (weeks-months)|medium-term (months-year)|long-term (years)",
      "explanation": "simple explanation of this risk",
      "prevention": "what can be done to prevent or reduce this risk"
    }
  ],
  "recommendations": [
    {
      "action": "specific recommended action",
      "priority": "Urgent — See doctor immediately|Soon — Within 2 weeks|Routine — Within 3 months",
      "details": "more helpful details about this action"
    }
  ],
  "lifestyle_improvements": [
    {
      "category": "Diet|Exercise|Sleep|Stress|Hydration|Lifestyle|Supplements",
      "tip": "specific, actionable improvement tip",
      "impact": "how this will help based on your report findings"
    }
  ],
  "questions_for_doctor": [
    "specific question to ask your doctor based on these findings"
  ],
  "medications_mentioned": [
    {
      "medication": "medication name",
      "purpose": "what it is for",
      "notes": "any relevant notes"
    }
  ],
  "next_steps": ["ordered list of what to do next, in priority order"],
  "disclaimer": "This AI analysis is for educational purposes only and does not replace professional medical advice. Always consult with your healthcare provider for diagnosis and treatment decisions."
}

Be thorough, empathetic, and clear. Prioritize patient understanding over medical accuracy in language. If data is missing or unclear, note it honestly."""


IMAGE_PROMPT = """You are a compassionate expert in medical imaging. Analyze this medical image (X-ray, MRI, CT scan, ultrasound, or similar) and return a JSON response that helps patients understand what was found.

IMPORTANT: Return ONLY valid JSON, no markdown, no explanation outside the JSON.

Return this exact JSON structure:
{
  "image_type": "X-Ray|MRI|CT Scan|Ultrasound|ECG|Other",
  "body_region": "which part of the body",
  "image_quality": "Excellent|Good|Fair|Poor",
  "overall_impression": "Normal|Mild Abnormality|Moderate Abnormality|Significant Abnormality|Requires Urgent Attention",
  "impression_color": "green|yellow|orange|red|red",
  "summary": "2-3 sentence plain English summary of what this image shows. Write for someone with no medical background.",
  "what_we_see": [
    "simple description of visible structure 1",
    "simple description of visible structure 2"
  ],
  "normal_findings": [
    {
      "structure": "anatomical structure",
      "observation": "what looks normal about it",
      "why_good": "why this is reassuring"
    }
  ],
  "abnormal_findings": [
    {
      "finding": "what was found",
      "location": "where in the image/body",
      "severity": "Mild|Moderate|Severe|Uncertain",
      "plain_explanation": "explain simply as if to a friend",
      "why_it_matters": "what this could mean for health",
      "confidence": "High|Moderate|Low — note that AI image analysis has limitations"
    }
  ],
  "future_concerns": [
    {
      "concern": "potential concern to monitor",
      "explanation": "simple explanation",
      "monitoring": "what kind of follow-up might be needed"
    }
  ],
  "recommendations": [
    {
      "action": "recommended action",
      "priority": "Urgent — See doctor immediately|Soon — Within 2 weeks|Routine — Within 3 months",
      "details": "more details about this recommendation"
    }
  ],
  "follow_up_tests": [
    {
      "test": "suggested test or scan",
      "reason": "why this might be recommended"
    }
  ],
  "questions_for_doctor": [
    "specific question to ask your doctor or radiologist"
  ],
  "important_notes": [
    "any important caveats or limitations about this analysis"
  ],
  "disclaimer": "Medical image analysis by AI has significant limitations. This analysis is for informational purposes only. A qualified radiologist and your treating physician must review all imaging for official diagnosis and treatment planning."
}

Be honest about uncertainty. If image quality is poor or findings are unclear, say so. Prioritize patient safety."""


SPECIALIST_PROMPT = """You are a compassionate medical advisor helping patients find the right specialist for their condition. Given a medical condition and city, provide detailed guidance.

IMPORTANT: Return ONLY valid JSON, no markdown, no explanation outside the JSON.

Return this exact JSON structure:
{{
  "condition": "{disease}",
  "city": "{city}",
  "overview": "2-3 sentence overview of this condition and why seeing a specialist matters. Be warm and reassuring.",
  "specialist_types": [
    {{
      "type": "Name of specialist (e.g. Endocrinologist)",
      "role": "What this specialist does and how they help with this condition",
      "when_to_see": "When you should specifically see this type of specialist"
    }}
  ],
  "questions_to_ask": [
    "Specific, practical question to ask the specialist about this condition"
  ],
  "what_to_bring": [
    "Item or document to bring to the appointment"
  ],
  "where_to_find": [
    {{
      "name": "Healthcare platform or directory name",
      "description": "How this platform helps find specialists in {city}",
      "search_tip": "Specific search tip for finding specialists on this platform",
      "url": "URL if well-known platform, else null"
    }}
  ],
  "urgency": "High|Moderate|Low",
  "urgency_timeframe": "See a doctor immediately|Within 1-2 weeks|Within 1 month|Routine check-up",
  "urgency_explanation": "Why this urgency level applies and what to watch for"
}}

Be specific about {city}-based resources where possible. Include 3-4 specialist types, 5-6 questions, 4-5 items to bring, and 3-4 places to find doctors. For Indian cities, mention Practo, 1mg, Apollo, Fortis, and other relevant platforms."""


def extract_json(text: str) -> dict:
    text = text.strip()
    if text.startswith("{"):
        return json.loads(text)
    match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', text, re.DOTALL)
    if match:
        return json.loads(match.group(1))
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if match:
        return json.loads(match.group(0))
    return {"raw_text": text, "parse_error": True}


def extract_pdf_text(content: bytes) -> str:
    reader = PyPDF2.PdfReader(io.BytesIO(content))
    text = ""
    for page in reader.pages:
        extracted = page.extract_text()
        if extracted:
            text += extracted + "\n"
    return text.strip()


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/health")
async def health_check():
    return {"status": "ok", "model": TEXT_MODEL, "app": "Vitalytics", "demo_mode": DEMO_MODE}


@app.post("/analyze-report")
async def analyze_report(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported for report analysis.")

    content = await file.read()
    if len(content) > 32 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 32MB.")

    if DEMO_MODE:
        return JSONResponse(content={"success": True, "type": "report", "analysis": DEMO_REPORT, "demo": True})

    try:
        pdf_text = extract_pdf_text(content)
    except Exception:
        raise HTTPException(status_code=400, detail="Could not read this PDF. Make sure it is a text-based PDF (not a scanned image).")

    if not pdf_text:
        raise HTTPException(
            status_code=400,
            detail="This PDF appears to be a scanned image with no readable text. Please use a PDF that was generated digitally (e.g. exported from a lab software), or take a clear photo and upload it via the Medical Image tab."
        )

    try:
        response = client.chat.completions.create(
            model=TEXT_MODEL,
            max_tokens=8192,
            messages=[{
                "role": "user",
                "content": f"Medical report text:\n\n{pdf_text}\n\n{REPORT_PROMPT}"
            }],
        )
        raw = response.choices[0].message.content
        analysis = extract_json(raw)
        return JSONResponse(content={"success": True, "type": "report", "analysis": analysis})

    except groq_module.AuthenticationError:
        raise HTTPException(status_code=401, detail="Invalid Groq API key. Please check your .env file.")
    except groq_module.RateLimitError:
        raise HTTPException(status_code=429, detail="Rate limit reached. Please try again in a moment.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    allowed_images = {
        "image/jpeg": "image/jpeg", "image/jpg": "image/jpeg",
        "image/png": "image/png", "image/gif": "image/gif", "image/webp": "image/webp",
    }

    ct = file.content_type or ""
    name = file.filename.lower() if file.filename else ""

    if ct == "application/pdf" or name.endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="PDF files are not supported for image analysis. Please export your X-ray or MRI as a JPG or PNG and upload that instead."
        )

    if ct not in allowed_images:
        if name.endswith((".jpg", ".jpeg")):
            ct = "image/jpeg"
        elif name.endswith(".png"):
            ct = "image/png"
        elif name.endswith(".gif"):
            ct = "image/gif"
        elif name.endswith(".webp"):
            ct = "image/webp"
        elif name.endswith((".dcm", ".dicom")):
            raise HTTPException(status_code=400, detail="DICOM files are not supported. Please export your X-ray as a JPG or PNG from your hospital app or radiology software.")
        else:
            raise HTTPException(status_code=400, detail="Unsupported format. Upload a JPG, PNG, WebP, or GIF image.")

    content = await file.read()
    if len(content) > 20 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 20MB.")

    if DEMO_MODE:
        return JSONResponse(content={"success": True, "type": "image", "analysis": DEMO_IMAGE, "demo": True})

    media_type = allowed_images.get(ct, ct)
    b64_data = base64.standard_b64encode(content).decode("utf-8")
    image_data_url = f"data:{media_type};base64,{b64_data}"

    try:
        response = client.chat.completions.create(
            model=VISION_MODEL,
            max_tokens=8096,
            messages=[{
                "role": "user",
                "content": [
                    {"type": "image_url", "image_url": {"url": image_data_url}},
                    {"type": "text", "text": IMAGE_PROMPT},
                ],
            }],
        )
        raw = response.choices[0].message.content
        analysis = extract_json(raw)
        return JSONResponse(content={"success": True, "type": "image", "analysis": analysis})

    except groq_module.AuthenticationError:
        raise HTTPException(status_code=401, detail="Invalid Groq API key. Please check your .env file.")
    except groq_module.RateLimitError:
        raise HTTPException(status_code=429, detail="Rate limit reached. Please try again in a moment.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image analysis failed: {type(e).__name__}: {str(e)}")


class SpecialistRequest(BaseModel):
    disease: str
    city: str


@app.post("/find-specialists")
async def find_specialists(req: SpecialistRequest):
    if not req.disease.strip() or not req.city.strip():
        raise HTTPException(status_code=400, detail="Both disease and city are required.")

    if DEMO_MODE:
        return JSONResponse(content={"success": True, **demo_specialist(req.disease, req.city), "demo": True})

    prompt = SPECIALIST_PROMPT.format(disease=req.disease, city=req.city)

    try:
        response = client.chat.completions.create(
            model=TEXT_MODEL,
            max_tokens=4096,
            messages=[{"role": "user", "content": prompt}],
        )
        raw = response.choices[0].message.content
        result = extract_json(raw)
        return JSONResponse(content={"success": True, **result})

    except groq_module.AuthenticationError:
        raise HTTPException(status_code=401, detail="Invalid Groq API key. Please check your .env file.")
    except groq_module.RateLimitError:
        raise HTTPException(status_code=429, detail="Rate limit reached. Please try again in a moment.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Specialist search failed: {str(e)}")