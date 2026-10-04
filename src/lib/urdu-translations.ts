// =============================================================================
// Smart.Dr — Urdu Translations for Disease Prediction App
// Pakistan-specific health app: authentic Urdu medical terms commonly used
// by Pakistani people (mix of pure Urdu and commonly-understood terms).
// =============================================================================

/**
 * Supported display languages.
 * - 'en'  : English only
 * - 'ur'  : Urdu only
 * - 'both': English with Urdu in parentheses — e.g. "Fever (بخار)"
 */
export type Language = 'en' | 'ur' | 'both';

// ---------------------------------------------------------------------------
// Symptom translations (English → Urdu)
// Organised by category for maintainability.
// ---------------------------------------------------------------------------

export const URDU_SYMPTOMS: Record<string, string> = {
  // --- Cardiovascular ---
  'Chest Discomfort': 'سینے میں بے چینی',
  'Chest Pain': 'سینے میں درد',
  'Chest Tightness': 'سینے میں جکڑن',
  'Irregular Heartbeat': 'دل کی غیر معمولی دھڑکن',
  'Low Blood Pressure': 'کم بلڈ پریشر',
  'Pounding in Chest/Neck': 'سینے یا گردن میں زور دار دھڑکن',
  'Rapid Heart Rate': 'تیز دل کی دھڑکن',
  'Rapid Heartbeat': 'تیز دل کی دھڑکن',
  'Slow Heart Rate': 'سست دل کی دھڑکن',

  // --- Digestive ---
  'Abdominal Pain': 'پیٹ میں درد',
  'Abdominal Tenderness': 'پیٹ میں نرمی اور درد',
  'Acid Reflux': 'ایسڈ ریفلکس',
  'Belching': 'ڈکار',
  'Bloating': 'پیٹ کا پھولنا',
  'Burning Sensation in Stomach': 'معدے میں جلن',
  'Clay-Colored Stools': 'مٹی رنگ کا پاخانہ',
  'Constipation': 'قبض',
  'Diarrhea': 'اسہال',
  'Gas': 'گیس',
  'Gastrointestinal Symptoms': 'معدے اور آنتوں کی تکالیف',
  'Heartburn': 'سینے میں جلن',
  'Indigestion': 'بدہضمی',
  'Irritable Bowel Symptoms': 'آنتوں کی حساسیت کی علامات',
  'Lower Abdominal Pain': 'نچلے پیٹ میں درد',
  'Mucus in Stool': 'پاخانے میں بلغم',
  'Nausea': 'متلی',
  'Pale Stools': 'ہلکے رنگ کا پاخانہ',
  'Regurgitation': 'کھانے کا واپس آنا',
  'Right Lower Abdominal Pain': 'دائیں نچلے پیٹ میں درد',
  'Right Upper Abdominal Pain': 'دائیں اوپر پیٹ میں درد',
  'Severe Watery Diarrhea': 'شدید پانی جیسا اسہال',
  'Upper Abdominal Pain': 'اوپر پیٹ میں درد',
  'Vomiting': 'الٹی',

  // --- Eyes ---
  'Blurred Vision': 'دھندلی نظر',
  'Cloudy Vision': 'بادل جیسی نظر',
  'Difficulty Seeing at Night': 'رات کو دیکھنے میں مشکل',
  'Double Vision': 'دوہری نظر',
  'Eye Discharge': 'آنکھ سے رطوبت',
  'Eye Pain': 'آنکھ میں درد',
  'Faded Colors': 'ماندار رنگ',
  'Frequent Prescription Changes': 'بار بار عینک نمبر بدلنا',
  'Gradual Peripheral Vision Loss': 'آہستہ آہستہ طرفی نظر کا جانا',
  'Gritty Feeling in Eyes': 'آنکھوں میں ریت جیسا احساس',
  'Halos Around Lights': 'روشنی کے گرد حلقے',
  'Itchy Eyes': 'آنکھوں میں خارش',
  'Pain Behind Eyes': 'آنکھوں کے پیچھے درد',
  'Red Eyes': 'سرخ آنکھیں',
  'Sensitivity to Light': 'روشنی سے حساسیت',
  'Sunken Eyes': 'دھنسی آنکھیں',
  'Swollen Eyelids': 'سوجی ہوئی پلکیں',
  'Tunnel Vision': 'سرنگ نما نظر',
  'Visual Disturbances': 'نظر کی خرابی',
  'Watery Eyes': 'پانی رشت آنکھیں',

  // --- General ---
  'Anemia Symptoms': 'خون کی کمی کی علامات',
  'Appetite Changes': 'بھوک میں تبدیلی',
  'Bad Breath': 'بدبو دار سانس',
  'Chills': 'سردی لگنا',
  'Cold Hands and Feet': 'ہاتھ پاؤں ٹھنڈے ہونا',
  'Cold Sensitivity': 'سردی سے حساسیت',
  'Daytime Fatigue': 'دن میں تھکاوٹ',
  'Dehydration': 'پانی کی کمی',
  'Difficulty Falling Asleep': 'سونے میں مشکل',
  'Dry Mouth': 'خشک منہ',
  'Excessive Thirst': 'زیادہ پیاس',
  'Fatigue': 'تھکاوٹ',
  'Fever': 'بخار',
  'Frequent Infections': 'بار بار انفیکشن',
  'Hiccups': 'ہچکی',
  'High Fever': 'تیز بخار',
  'Increased Hunger': 'زیادہ بھوک لگنا',
  'Insomnia': 'بے خوابی',
  'Jaundice': 'یرقان',
  'Loss of Appetite': 'بھوک نہ لگنا',
  'Mild Bleeding': 'ہلکا خون بہنا',
  'Mild Fever': 'ہلکا بخار',
  'Mouth Ulcers': 'منہ کے چھالے',
  'Night Sweats': 'رات کو پسینہ آنا',
  'Nosebleeds': 'ناک سے خون بہنا',
  'Puffy Face': 'سوجا ہوا چہرہ',
  'Receding Gums': 'مسوڑھے کا سکڑنا',
  'Sleep Disturbances': 'نیند کی خرابی',
  'Sweating': 'پسینہ آنا',
  'Trouble Sleeping': 'نیند میں مشکل',
  'Unexplained Weight Loss': 'بغیر وجہ وزن کم ہونا',
  'Waking Up During Night': 'رات میں بیدار ہونا',
  'Weakness': 'کمزوری',
  'Weight Gain': 'وزن بڑھنا',
  'Weight Loss': 'وزن کم ہونا',

  // --- Musculoskeletal ---
  'Back Pain': 'کمر درد',
  'Body Aches': 'جسم میں درد',
  'Bone Fractures': 'ہڈیوں کے ٹوٹ',
  'Bone Spurs': 'ہڈی کا اضافی بڑھاؤ',
  'Difficulty Standing': 'کھڑے ہونے میں مشکل',
  'Grinding Sensation': 'رگڑ کا احساس',
  'Jaw Pain': 'جبڑے میں درد',
  'Joint Pain': 'جوڑوں کا درد',
  'Joint Stiffness': 'جوڑوں کی اکڑن',
  'Joint Swelling': 'جوڑوں کی سوجن',
  'Joint Warmth': 'جوڑوں کی گرمی',
  'Limited Range of Motion': 'حرکت کی محدودیت',
  'Loss of Height': 'قد کا کم ہونا',
  'Muscle Cramps': 'پٹھوں کے اینٹھن',
  'Muscle Pain': 'پٹھوں میں درد',
  'Muscle Tension': 'پٹھوں میں تناؤ',
  'Muscle Weakness': 'پٹھوں کی کمزوری',
  'Neck Stiffness': 'گردن کی اکڑن',
  'Pain with Movement': 'حرکت سے درد',
  'Pelvic Pain': 'حوض کا درد',
  'Reduced Range of Motion': 'حرکت کی کمی',
  'Severe Back Pain': 'شدید کمر درد',
  'Severe Body Aches': 'شدید جسم درد',
  'Severe Joint Pain': 'شدید جوڑوں کا درد',
  'Stooped Posture': 'جھکی ہوئی حالت',
  'Swelling': 'سوجن',
  'Tenderness': 'درد والی نرمی',
  'Widespread Body Pain': 'پورے جسم میں درد',

  // --- Neurological ---
  'Cognitive Difficulties': 'ذہنی مشکلات',
  'Difficulty Concentrating': 'توجہ مرکوز کرنے میں مشکل',
  'Dizziness': 'چکر آنا',
  'Facial Pain/Pressure': 'چہرے میں درد یا دباؤ',
  'Headache': 'سر درد',
  'Loss of Smell': 'بو کا جانا',
  'Loss of Taste': 'ذائقے کا جانا',
  'Memory Problems': 'یاداشت کے مسائل',
  'Numbness in Hands/Feet': 'ہاتھ پاؤں میں سن پن',
  'Reduced Sense of Smell': 'بو کی کمزوری',
  'Sensitivity to Sound': 'آواز سے حساسیت',
  'Severe Headache': 'شدید سر درد',
  'Tingling in Hands/Feet': 'ہاتھ پاؤں میں جھنجھناہٹ',

  // --- Psychological ---
  'Anxiety': 'گھبراہٹ',
  'Depression': 'ڈپریشن',
  'Excessive Worry': 'زیادہ فکر مندی',
  'Feelings of Worthlessness': 'بے وقعت ہونے کا احساس',
  'Irritability': 'چڑچڑاپن',
  'Loss of Interest': 'دلچسپی کا جانا',
  'Persistent Sadness': 'مسلسل اداسی',
  'Restlessness': 'بے قراری',

  // --- Respiratory ---
  'Cough': 'کھانسی',
  'Coughing Blood': 'خون تھوکنا',
  'Difficulty Breathing': 'سانس لینے میں مشکل',
  'Dry Cough': 'خشک کھانسی',
  'Itchy Nose': 'ناک میں خارش',
  'Mucus Production': 'بلغم بننا',
  'Nasal Congestion': 'ناک بند ہونا',
  'Postnasal Drip': 'ناک کے پیچھے سے بلغم گرنا',
  'Rapid Breathing': 'تیز سانس',
  'Runny Nose': 'ناک بہنا',
  'Shortness of Breath': 'سانس کی قلت',
  'Sneezing': 'چھینک',
  'Wheezing': 'سانس میں سیٹی جیسی آواز',

  // --- Skin ---
  'Brittle Nails': 'کمزور ناخن',
  'Butterfly Rash on Face': 'چہرے پر تتلی نما دانے',
  'Dry Cracked Skin': 'خشک اور پھٹی ہوئی جلد',
  'Dry Skin': 'خشک جلد',
  'Hair Loss': 'بال گرنا',
  'Itchy Rash': 'خارش والے دانے',
  'Itchy Skin': 'جلد میں خارش',
  'Loss of Skin Elasticity': 'جلد کی لچک کا جانا',
  'Nail Pitting': 'ناخن میں گڑھے',
  'Pale Skin': 'زرد جلد',
  'Photosensitivity': 'روشنی سے حساسیت',
  'Red Patches': 'سرخ دھبے',
  'Red Skin Patches': 'جلد پر سرخ دھبے',
  'Redness Around Joint': 'جوڑ کے اردگرد سرخی',
  'Silvery Scales': 'چاندی جیسے چھلے',
  'Skin Blisters': 'جلد کے چھالے',
  'Skin Burning': 'جلد میں جلن',
  'Skin Cracking': 'جلد کا پھٹنا',
  'Skin Infections': 'جلد کے انفیکشن',
  'Skin Peeling Around Joint': 'جوڑ کے اردگرد جلد اترنا',
  'Skin Rash': 'جلد پر دانے',
  'Skin Swelling': 'جلد کی سوجن',
  'Slow Healing Wounds': 'زخم کا آہستہ بھرنا',
  'Small Bumps': 'چھوٹے دانے',
  'Thickened Nails': 'موٹے ناخن',
  'Thickened Skin': 'موٹی جلد',

  // --- Throat ---
  'Difficulty Swallowing': 'نگلنے میں مشکل',
  'Hoarseness': 'آواز کا بیٹھنا',
  'Sore Throat': 'گلے کا درد',

  // --- Urinary ---
  'Blood in Urine': 'پیشاب میں خون',
  'Burning Sensation During Urination': 'پیشاب کرتے وقت جلن',
  'Cloudy Urine': 'دھندلا پیشاب',
  'Dark Urine': 'گہرا پیشاب',
  'Frequent Urination': 'بار بار پیشاب آنا',
  'Kidney Problems': 'گردوں کے مسائل',
  'Pain During Urination': 'پیشاب کرتے وقت درد',
  'Strong-Smelling Urine': 'تیز بو والا پیشاب',
};

// ---------------------------------------------------------------------------
// Disease translations (English → Urdu)
// ---------------------------------------------------------------------------

export const URDU_DISEASES: Record<string, string> = {
  'Common Cold': 'زکام',
  'Influenza': 'انفلوئنزا',
  'Pneumonia': 'نمونیہ',
  'Bronchitis': 'برونکائٹس',
  'Asthma': 'دمہ',
  'Tuberculosis': 'ٹی بی',
  'Gastroenteritis': 'پیٹ کی سوزش',
  'GERD': 'ایسڈ ریفلکس بیماری',
  'Peptic Ulcer': 'معدے کا السر',
  'Irritable Bowel Syndrome': 'آنتوں کی حساسیت کی بیماری',
  'Hepatitis': 'ہیپاٹائٹس',
  'Migraine': 'مائیگرین',
  'Epilepsy': 'مرگی',
  'Meningitis': 'میننجائٹس',
  'Stroke': 'فالج',
  "Parkinson's Disease": 'پارکنسنز بیماری',
  'Hypertension': 'ہائی بلڈ پریشر',
  'Heart Disease': 'دل کی بیماری',
  'Diabetes': 'شوگر',
  'Hypothyroidism': 'تھائرائیڈ کی کمی',
  'Hyperthyroidism': 'تھائرائیڈ کی زیادتی',
  'Dengue Fever': 'ڈینگی بخار',
  'Malaria': 'ملیریا',
  'Typhoid': 'ٹائیفائیڈ',
  'Chickenpox': 'ماتا',
  'Dermatitis': 'جلد کی سوزش',
  'Arthritis': 'گٹھیا',
  'Cholera': 'ہیضہ',
  'Food Poisoning': 'کھانے کی زہر آلودگی',
  'Appendicitis': 'اپینڈکس کی سوزش',
  'Gallstones': 'پتے کی پتھری',
  'Osteoporosis': 'ہڈیوں کی کمزوری',
  'Gout': 'یورک ایسڈ کی بیماری',
  'Glaucoma': 'گلوکوما',
  'Cataracts': 'موتیا',
  'Anxiety Disorder': 'گھبراہٹ کی بیماری',
  'Insomnia': 'بے خوابی',
  'Celiac Disease': 'سیلیاک بیماری',
  'Psoriasis': 'سوریاسس',
  'Lupus': 'لوبس',
  'Fibromyalgia': 'فائبرومائیلجیا',
};

// ---------------------------------------------------------------------------
// Category translations (English → Urdu)
// ---------------------------------------------------------------------------

export const URDU_CATEGORIES: Record<string, string> = {
  'Cardiovascular': 'قلبی وعائی',
  'Digestive': 'ہاضمہ',
  'Eyes': 'آنکھیں',
  'General': 'عمومی',
  'Musculoskeletal': 'ہڈیاں اور پٹھے',
  'Neurological': 'اعصابی',
  'Psychological': 'ذہنی',
  'Respiratory': 'سانس',
  'Skin': 'جلد',
  'Throat': 'گلا',
  'Urinary': 'پیشاب',
  'ENT': 'کان ناک گلا',
};

// ---------------------------------------------------------------------------
// Severity translations (English → Urdu)
// ---------------------------------------------------------------------------

export const URDU_SEVERITY: Record<string, string> = {
  'mild': 'ہلکا',
  'moderate': 'درمیانہ',
  'severe': 'شدید',
};

// ---------------------------------------------------------------------------
// UI label translations (English → Urdu)
// ---------------------------------------------------------------------------

export const URDU_UI: Record<string, string> = {
  'Symptom Checker': 'علامات چیکر',
  'Select Your Symptoms': 'اپنی علامات منتخب کریں',
  'Search symptoms': 'علامات تلاش کریں',
  'Quick Select': 'جلدی منتخب',
  'Body Map': 'جسم کا نقشہ',
  'Selected Symptoms': 'منتخب علامات',
  'Clear All': 'سب مٹائیں',
  'Predict Disease': 'بیماری کی پیشین گوئی',
  'No symptoms selected': 'کوئی علامت منتخب نہیں',
  'No predictions yet': 'ابھی تک کوئی پیشین گوئی نہیں',
  'Prediction Results': 'پیشین گوئی کے نتائج',
  'Top Prediction': 'سب سے بڑی پیشین گوئی',
  'Confidence Level': 'اعتماد کی سطح',
  'Matched Symptoms': 'ملتی جلتی علامات',
  'Common Symptoms': 'عام علامات',
  'Precautions': 'احتیاطی تدابیر',
  'Medications': 'ادویات',
  'Diet Recommendations': 'غذا کی تجاویز',
  'Browse Diseases': 'بیماریوں کو دیکھیں',
  'Disease Database': 'بیماریوں کا ڈیٹابیس',
  'Back to Symptom Checker': 'علامات چیکر پر واپس',
  'Flu-like': 'فلو جیسی',
  'Cold': 'زکام',
  'Stomach Issues': 'پیٹ کے مسائل',
  'Heart Concerns': 'دل کی تشویشات',
  'For educational purposes only': 'صرف تعلیمی مقاصد کے لیے',
  'Always consult a healthcare professional': 'ہمیشہ صحت کے ماہر سے مشورہ کریں',
  'AI-Generated Results': 'اے آئی سے تیار کردہ نتائج',
  'symptoms matched': 'علامات ملے',
  'How It Works': 'یہ کیسے کام کرتا ہے',
  'Features': 'خصوصیات',
  'Dashboard': 'ڈیش بورڈ',
  'Home': 'ہوم',
  'Download Project': 'پروجیکٹ ڈاؤن لوڈ',
};

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

/**
 * Returns the display name based on the chosen language preference.
 *
 * @param english  - English text
 * @param urdu     - Urdu text
 * @param lang     - Language preference: 'en' | 'ur' | 'both'
 * @returns Formatted string according to language preference
 *
 * @example
 * getDisplayName('Fever', 'بخار', 'en')   // "Fever"
 * getDisplayName('Fever', 'بخار', 'ur')   // "بخار"
 * getDisplayName('Fever', 'بخار', 'both') // "Fever (بخار)"
 */
export function getDisplayName(
  english: string,
  urdu: string,
  lang: Language,
): string {
  switch (lang) {
    case 'en':
      return english;
    case 'ur':
      return urdu;
    case 'both':
      return `${english} (${urdu})`;
    default:
      return english;
  }
}

/**
 * Checks whether the given text contains Urdu characters.
 * Urdu characters fall in the Unicode range U+0600–U+06FF (Arabic block)
 * and U+0750–U+077F (Arabic Supplement), plus extended ranges
 * U+FB50–U+FDFF and U+FE70–U+FEFF used by Arabic Presentation Forms.
 *
 * @param text - The text to check
 * @returns true if any Urdu character is found
 *
 * @example
 * isUrduText('بخار')       // true
 * isUrduText('Fever')      // false
 * isUrduText('Fever بخار') // true
 */
export function isUrduText(text: string): boolean {
  // Unicode ranges that cover Urdu/Arabic script characters
  const urduRegex = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return urduRegex.test(text);
}

// ---------------------------------------------------------------------------
// Clinical Symptom Descriptions (English & Urdu)
// Short, medically accurate explanations for tooltips and hover cards
// ---------------------------------------------------------------------------

export const SYMPTOM_DESCRIPTIONS: Record<string, { en: string; ur: string }> = {
  // --- Cardiovascular ---
  'Chest Discomfort': { en: 'A mild aching, heaviness, or awkward feeling in the chest area.', ur: 'سینے کے حصے میں ہلکا درد، بوجھ یا بے چینی کا احساس۔' },
  'Chest Pain': { en: 'Sharp, dull, or squeezing pain in the chest that may radiate to neck, shoulder, or arm.', ur: 'سینے میں تیز یا دبانے والا درد جو گردن، کندھے یا بازو تک جا سکتا ہے۔' },
  'Chest Tightness': { en: 'Constricting sensation like a tight band around the chest, often linked to asthma or angina.', ur: 'سینے پر دباؤ یا جکڑن کا احساس جیسے کوئی بھاری چیز رکھی ہو۔' },
  'Irregular Heartbeat': { en: 'Sensation of missed, skipped, fluttering, or extra heartbeats (arrhythmia).', ur: 'دل کی دھڑکن کا بے قاعدہ ہونا، رک رک کر چلنا یا تیز پھڑکنا۔' },
  'Low Blood Pressure': { en: 'Abnormally low arterial pressure causing dizziness, faintness, or blurred vision.', ur: 'بلڈ پریشر کا معمول سے کم ہونا جس سے چکر اور کمزوری آئے۔' },
  'Rapid Heart Rate': { en: 'Heart beating significantly faster than the normal resting rate of 60-100 bpm.', ur: 'آرام کی حالت میں بھی دل کی دھڑکن کا معمول سے کافی تیز ہونا۔' },
  'Rapid Heartbeat': { en: 'Palpitations where heart beats unusually hard, fast, or erratically.', ur: 'دل کا زور سے اور تیزی سے دھڑکنا یا گھبراہٹ پیدا ہونا۔' },
  'Slow Heart Rate': { en: 'Resting heart rate below 60 beats per minute, causing fatigue or lightheadedness.', ur: 'دل کی دھڑکن کا معمول سے سست ہونا جس سے تھکاوٹ یا غنودگی آئے۔' },
  'Pounding in Chest/Neck': { en: 'Strong, forceful heartbeat felt intensely in the chest or carotid arteries.', ur: 'سینے یا گردن کی رگوں میں دل کی تیز دھڑکن کا شدید احساس۔' },

  // --- Digestive ---
  'Abdominal Pain': { en: 'Cramping, aching, or sharp discomfort felt anywhere in the belly region.', ur: 'پیٹ کے کسی بھی حصے میں مروڑ، کھچاؤ یا درد کی تکلیف۔' },
  'Abdominal Tenderness': { en: 'Pain or discomfort triggered when pressure is applied to the abdomen.', ur: 'پیٹ پر ہاتھ لگانے یا دبانے پر درد کا محسوس ہونا۔' },
  'Acid Reflux': { en: 'Stomach acid rising back up into the esophagus causing burning and sour taste.', ur: 'معدے کے تیزاب کا خوراک کی نالی میں واپس آنا جس سے ترش ذائقہ ہو۔' },
  'Belching': { en: 'Expulsion of swallowed gas from the stomach through the mouth.', ur: 'معدے سے ہوا یا گیس کا ڈکار کے ذریعے منہ سے خارج ہونا۔' },
  'Bloating': { en: 'Swelling or feeling of fullness and tightness in the abdomen caused by trapped gas.', ur: 'پیٹ کا گیس کی وجہ سے پھولنا یا بھاری پن محسوس ہونا۔' },
  'Burning Sensation in Stomach': { en: 'Painful warmth or burning in the stomach lining, often due to gastritis or ulcer.', ur: 'معدے میں تیزابی جلن کا احساس جو معدے کے زخم یا سوزش کی نشانی ہو سکتا ہے۔' },
  'Clay-Colored Stools': { en: 'Pale or clay-like bowel movements indicating reduced bile flow from the liver.', ur: 'مٹی کے رنگ کا ہلکا پاخانہ جو جگر یا پتے کے امراض کی علامت ہے۔' },
  'Constipation': { en: 'Infrequent, difficult, or painful passage of hard, dry bowel movements.', ur: 'اجابت میں دقت، پاخانے کا سخت ہونا یا کئی دن نہ آنا۔' },
  'Diarrhea': { en: 'Frequent passage of loose, watery stools leading to fluid and electrolyte loss.', ur: 'بار بار پتلے پانی جیسے پاخانے آنا جس سے کمزوری اور پانی کی کمی ہو۔' },
  'Gas': { en: 'Intestinal air causing flatulence, rumbling noises, and mild cramping.', ur: 'آنتوں میں ہوا کا بننا جس سے پیٹ میں مروڑ اور بے چینی ہو۔' },
  'Heartburn': { en: 'Burning sensation in the central chest behind breastbone after meals.', ur: 'کھانے کے بعد سینے کے درمیان میں جلن اور تیزابیت کا احساس۔' },
  'Indigestion': { en: 'Discomfort, burning, or early fullness in upper stomach during eating.', ur: 'کھانے کے بعد پیٹ میں بدہضمی، جلن یا کھانا ہضم نہ ہونا۔' },
  'Mucus in Stool': { en: 'Jelly-like substance visible in stool signaling intestinal inflammation.', ur: 'پاخانے کے ساتھ لیس دار مادے یا آنو کا اخراج جو آنتوں کی سوزش ظاہر کرے۔' },
  'Nausea': { en: 'Queasy sensation in the stomach with an urge to vomit.', ur: 'جی متلانا اور قے آنے کا شدید احساس ہونا۔' },
  'Right Lower Abdominal Pain': { en: 'Localized pain in lower right abdomen, a primary symptom of appendicitis.', ur: 'دائیں طرف پیٹ کے نچلے حصے میں درد، جو اپینڈکس کی خاص علامت ہے۔' },
  'Right Upper Abdominal Pain': { en: 'Discomfort under right ribcage often associated with gallbladder or liver.', ur: 'دائیں پسلی کے نیچے درد جو پتے یا جگر کے مسائل کی نشاندہی کرتا ہے۔' },
  'Severe Watery Diarrhea': { en: 'Extreme watery diarrhea causing critical risk of rapid dehydration.', ur: 'شدید پتلے دست جس سے جسم میں پانی کی خطرناک کمی ہو سکتی ہے۔' },
  'Vomiting': { en: 'Involuntary, forceful ejection of stomach contents through the mouth.', ur: 'معدے کے مواد کا منہ کے ذریعے زبردستی باہر نکل آنا۔' },

  // --- Respiratory ---
  'Cough': { en: 'Sudden, repetitive reflex to clear the throat and respiratory airway.', ur: 'گلے اور ہوا کی نالیوں کو صاف کرنے کا اضطراری ردعمل۔' },
  'Coughing Blood': { en: 'Spitting or coughing up blood from the respiratory tract (hemoptysis).', ur: 'کھانسی کے ساتھ خون یا خونی بلغم کا آنا۔' },
  'Difficulty Breathing': { en: 'Labored, uncomfortable breathing requiring extra conscious physical effort.', ur: 'سانس لینے میں دشواری اور پھیپھڑوں پر غیر معمولی بوجھ۔' },
  'Dry Cough': { en: 'Tickling, irritating cough without any phlegm or mucus production.', ur: 'بغیر بلغم کے مسلسل گلے میں خارش کرنے والی کھانسی۔' },
  'Mucus Production': { en: 'Excess phlegm or sputum coughed up from bronchial passages.', ur: 'کھانسی کے ساتھ پھیپھڑوں یا نالیوں سے بلغم کا خارج ہونا۔' },
  'Nasal Congestion': { en: 'Blockage of nasal passages due to swollen membranes and mucus.', ur: 'ناک کے اندر سوجن اور بلغم کی وجہ سے ناک بند ہونا۔' },
  'Postnasal Drip': { en: 'Excess mucus accumulating in the back of the throat from nasal sinuses.', ur: 'ناک کے پچھلے حصے سے گلے میں بلغم کا مسلسل گرنا۔' },
  'Rapid Breathing': { en: 'Breathing much faster than normal (tachypnea) to compensate for oxygen demand.', ur: 'سانس کی رفتار کا معمول سے بہت زیادہ تیز ہونا۔' },
  'Runny Nose': { en: 'Excessive thin mucus drainage flowing freely from the nasal passages.', ur: 'ناک سے پتلی رطوبت کا مسلسل بہنا۔' },
  'Shortness of Breath': { en: 'Breathlessness or struggle to inhale adequate oxygen into lungs.', ur: 'سانس لینے میں شدید تنگی، گھٹن یا ہوا کی کمی محسوس ہونا۔' },
  'Sneezing': { en: 'Involuntary, explosive discharge of air through nose and mouth.', ur: 'ناک کی نالی میں الرجی یا مٹی کی وجہ سے زور دار چھینک آنا۔' },
  'Wheezing': { en: 'High-pitched whistling sound during breathing caused by narrowed airways.', ur: 'سانس اندر یا باہر نکالتے وقت سیٹی جیسی باریک آواز آنا۔' },

  // --- General ---
  'Fever': { en: 'Elevation of body temperature above normal baseline, signaling active immune response.', ur: 'جسم کے درجہ حرارت میں معمول سے زیادہ اضافہ جو انفیکشن کی نشانی ہے۔' },
  'Mild Fever': { en: 'Slightly elevated temperature (99°F-100.4°F) common in mild viral illnesses.', ur: 'ہلکا سا بخار جو عام طور پر موسمی نزلہ زکام میں ہوتا ہے۔' },
  'High Fever': { en: 'Body temperature exceeding 102°F (38.9°C) requiring medical evaluation.', ur: 'تیز بخار جو عام طور پر شدید وائرل یا بیکٹیریل انفیکشن میں ہوتا ہے۔' },
  'Chills': { en: 'Shivering, trembling, and feeling very cold during sudden temperature rise.', ur: 'بخار چڑھنے سے پہلے جسم میں سردی لگنا اور کپکپی طاری ہونا۔' },
  'Fatigue': { en: 'Persistent tiredness and exhaustion draining mental and physical capability.', ur: 'شدید تھکن اور توانائی کا ختم ہونا جو آرام سے بھی ٹھیک نہ ہو۔' },
  'Weakness': { en: 'Reduced muscle strength or systemic lack of physical stamina.', ur: 'جسم اور پٹھوں میں طاقت کی کمی اور سستی کا غلبہ۔' },
  'Dehydration': { en: 'Deficiency of water in bodily tissues causing thirst, dry tongue, and dark urine.', ur: 'جسم میں پانی کی کمی جس سے زبان خشک اور پیشاب گہرا ہو جائے۔' },
  'Loss of Appetite': { en: 'Decreased desire or hunger to consume normal food portions.', ur: 'کھانے کی رغبت اور بھوک کا ختم یا بہت کم ہو جانا۔' },
  'Unexplained Weight Loss': { en: 'Noticeable drop in body weight without dieting or increased physical exercise.', ur: 'بغیر کسی ڈائٹ یا ورزش کے اچانک وزن میں نمایاں کمی۔' },
  'Weight Gain': { en: 'Unintended increase in body mass, possibly from fluid retention or thyroid slowdown.', ur: 'بغیر کسی خاص وجہ کے جسمانی وزن میں غیر معمولی اضافہ۔' },
  'Sweating': { en: 'Excess perspiration not explained by room temperature or intense exercise.', ur: 'معمول سے زیادہ پسینہ آنا جو بخار ٹوٹنے یا کمزوری کی علامت ہو۔' },
  'Night Sweats': { en: 'Repeated severe sweating episodes during sleep soaking nightclothes.', ur: 'رات کو سوتے وقت اتنا پسینہ آنا کہ کپڑے بھیگ جائیں۔' },
  'Insomnia': { en: 'Chronic difficulty falling asleep, staying asleep, or achieving restful rest.', ur: 'نیند نہ آنا، بار بار آنکھ کھلنا یا بے چینی کی کیفیت۔' },
  'Jaundice': { en: 'Yellowing of skin and whites of the eyes caused by high bilirubin levels.', ur: 'جگر کے کام نہ کرنے کی وجہ سے جلد اور آنکھوں کا پیلا پڑ جانا۔' },
  'Mouth Ulcers': { en: 'Painful sores inside lips, cheeks, or tongue causing eating discomfort.', ur: 'منہ کے اندر، گال یا زبان پر دردناک چھالے بن جانا۔' },

  // --- Neurological ---
  'Headache': { en: 'Pain or throbbing discomfort felt across the skull, temples, or forehead.', ur: 'سر کے ماتھے، کنپٹیوں یا پچھلے حصے میں درد یا بھاری پن۔' },
  'Severe Headache': { en: 'Intense, incapacitating head pain that may signify migraine or high pressure.', ur: 'شدید ناقابل برداشت سر درد جس کے ساتھ روشنی اور آواز بری لگے۔' },
  'Dizziness': { en: 'Lightheaded, ungrounded sensation with feeling of loss of balance.', ur: 'سر چکرانا اور توازن برقرار رکھنے میں مشکل پیش آنا۔' },
  'Difficulty Concentrating': { en: 'Brain fog, distraction, and difficulty maintaining focus on tasks.', ur: 'کسی کام میں دھیان لگانے اور ذہن مرکوز کرنے میں دقت۔' },
  'Loss of Smell': { en: 'Inability to detect odors (anosmia), common in respiratory viral infections.', ur: 'سونگھنے کی صلاحیت کا ختم ہو جانا یا خوشبو بدبو محسوس نہ ہونا۔' },
  'Loss of Taste': { en: 'Diminished ability to taste foods (ageusia), often paired with loss of smell.', ur: 'چکھنے کی حس ختم ہو جانا اور کھانے کا ذائقہ نہ آنا۔' },
  'Numbness in Hands/Feet': { en: 'Loss of sensation, pins-and-needles, or dead feeling in fingers or toes.', ur: 'ہاتھوں یا پاؤں میں احساس کا ختم ہونا یا سن ہو جانا۔' },
  'Tingling in Hands/Feet': { en: 'Prickling or pins-and-needles sensation caused by nerve irritation.', ur: 'ہاتھ پاؤں میں سوئیاں چبھنے یا چیونٹیاں رینگنے کا احساس۔' },

  // --- Musculoskeletal ---
  'Joint Pain': { en: 'Aching, tenderness, or stiffness localized in one or more skeletal joints.', ur: 'ہڈیوں کے جوڑوں میں درد، سوجن یا اٹھنے بیٹھنے میں تکلیف۔' },
  'Joint Stiffness': { en: 'Difficulty moving joints freely, especially upon waking in the morning.', ur: 'صبح بیدار ہونے پر جوڑوں کا سخت اور جکڑا ہوا ہونا۔' },
  'Joint Swelling': { en: 'Enlargement, puffiness, and fluid accumulation surrounding a joint.', ur: 'جوڑ کے اردگرد سوجن آنا اور اس کا پھیل جانا۔' },
  'Joint Warmth': { en: 'Increased heat radiating from an inflamed or infected joint area.', ur: 'متاثرہ جوڑ کا چھونے پر گرم محسوس ہونا۔' },
  'Muscle Cramps': { en: 'Sudden, painful, involuntary contraction of one or more muscles.', ur: 'پٹھوں کا اچانک اینٹھ جانا اور شدید کھچاؤ پیدا ہونا۔' },
  'Muscle Pain': { en: 'Soreness, cramping, or aching within muscular tissue (myalgia).', ur: 'پٹھوں میں کھچاؤ، اکڑن یا درد کا احساس۔' },
  'Back Pain': { en: 'Ache, stiffness, or sharp discomfort in upper, mid, or lower back.', ur: 'کمر کے اوپر یا نچلے حصے میں درد یا جھکنے میں دشواری۔' },
  'Body Aches': { en: 'Diffuse, generalized musculoskeletal aching typical of viral infections.', ur: 'پورے جسم میں ہلکا یا شدید درد جو انفیکشن کی وجہ سے ہو۔' },
  'Neck Stiffness': { en: 'Inability to flex or turn the neck freely without discomfort.', ur: 'گردن کا اکڑ جانا اور دائیں بائیں موڑنے میں تکلیف ہونا۔' },
  'Bone Fractures': { en: 'Broken bone integrity resulting from trauma or bone density loss.', ur: 'چوٹ لگنے یا ہڈیوں کی کمزوری سے ہڈی کا ٹوٹ جانا۔' },

  // --- Eyes ---
  'Blurred Vision': { en: 'Lack of visual sharpness and loss of crisp focus on objects.', ur: 'چیزوں کا صاف نظر نہ آنا اور نظر میں دھندلا پن ہونا۔' },
  'Cloudy Vision': { en: 'Hazy, foggy sight as if looking through a frosty window (cataracts).', ur: 'نظر کا دھندلا اور بادل جیسا ہونا جیسے شیشہ دھندلا ہو۔' },
  'Eye Pain': { en: 'Stabbing, burning, or throbbing discomfort inside or around the eye orbit.', ur: 'آنکھ کے اندر یا اردگرد تیز جلن یا درد کا احساس۔' },
  'Pain Behind Eyes': { en: 'Ache localized deep in the eye socket, classic sign of dengue fever.', ur: 'آنکھ کی پتلی کے پچھلے حصے میں درد جو ڈینگی کی خاص علامت ہے۔' },
  'Red Eyes': { en: 'Bloodshot appearance due to swollen, inflamed conjunctival blood vessels.', ur: 'آنکھوں کی نالیوں میں سوزش کی وجہ سے آنکھوں کا لال ہونا۔' },
  'Sensitivity to Light': { en: 'Discomfort or pain caused by normal indoor or daylight exposure (photophobia).', ur: 'روشنی برداشت نہ ہونا اور روشنی میں آنکھیں چندھیا جانا۔' },
  'Watery Eyes': { en: 'Excessive tearing overflowing onto cheeks due to allergies or irritation.', ur: 'آنکھوں سے مسلسل پانی بہنا یا آنسوؤں کی زیادتی۔' },

  // --- Skin ---
  'Skin Rash': { en: 'Noticeable change in skin texture or color with bumps, spots, or redness.', ur: 'جلد پر سرخی، کھردرا پن یا سرخ دانوں کا نمودار ہونا۔' },
  'Itchy Skin': { en: 'Irritating sensation triggering an uncontrollable desire to scratch.', ur: 'جلد میں مسلسل خارش کا احساس اور کھجانے کی طلب۔' },
  'Dry Skin': { en: 'Rough, flaky, or tight skin lacking natural lipid moisture.', ur: 'جلد میں خشکی، کھردرا پن یا سفید پپڑیاں بننا۔' },
  'Dry Cracked Skin': { en: 'Severe dryness causing painful fissures in the epidermis.', ur: 'شدید خشکی کے باعث جلد کا پھٹنا اور دراڑیں پڑنا۔' },
  'Skin Blisters': { en: 'Small fluid-filled bubbles raised above the outer skin surface.', ur: 'جلد کے اوپر پانی سے بھرے چھوٹے چھالے بن جانا۔' },
  'Butterfly Rash on Face': { en: 'Distinctive malar rash bridging across cheeks and nose bridge (Lupus).', ur: 'ناک اور گالوں پر تتلی کی شکل کے سرخ دانے (لیوپس کی علامت)۔' },
  'Silvery Scales': { en: 'Thick, white-silvery patches of flaking skin typical of psoriasis.', ur: 'جلد پر چاندی جیسے چمکدار سفید چھلکے اور کھردرا پن۔' },

  // --- Throat ---
  'Sore Throat': { en: 'Scratchiness, raw irritation, and pain in the throat, worse when swallowing.', ur: 'گلے میں خراش، سوجن اور کوئی چیز نگلتے وقت شدید درد۔' },
  'Difficulty Swallowing': { en: 'Pain or sensation of obstruction when attempting to swallow liquids or solids.', ur: 'کھانا یا پانی نگلتے وقت گلے میں رکاوٹ یا تکلیف۔' },
  'Hoarseness': { en: 'Raspy, strained, or muffled vocal tone caused by vocal cord inflammation.', ur: 'آواز کا بیٹھ جانا یا بولنے میں خرخراہٹ پیدا ہونا۔' },

  // --- Urinary ---
  'Burning Sensation During Urination': { en: 'Stinging or burning discomfort while passing urine (dysuria).', ur: 'پیشاب کرتے وقت نالی میں جلن اور شدید چبھن۔' },
  'Frequent Urination': { en: 'Urge to urinate far more often than normal daytime frequency.', ur: 'بار بار پیشاب کی حاجت ہونا اور تھوڑی مقدار میں آنا۔' },
  'Dark Urine': { en: 'Amber, tea-colored, or brown urine indicating concentrated bile or dehydration.', ur: 'پیشاب کا رنگ معمول سے گہرا زرد یا چائے جیسا ہونا۔' },
  'Blood in Urine': { en: 'Red, pink, or brownish tinge in urine signaling urinary tract bleeding.', ur: 'پیشاب میں خون کی آمیزش یا اس کا گلابی/سرخ ہونا۔' },
  'Cloudy Urine': { en: 'Milky, turbid urine often caused by urinary tract bacterial infection.', ur: 'پیشاب کا دھندلا یا گدلا ہونا جو انفیکشن ظاہر کرتا ہے۔' },

  // --- Psychological ---
  'Anxiety': { en: 'Intense, persistent feelings of dread, nervous tension, and unease.', ur: 'شدید بے چینی، گھبراہٹ اور دل ڈوبنے کا احساس۔' },
  'Depression': { en: 'Prolonged low mood, loss of interest, and profound sense of despair.', ur: 'مسلسل اداسی، مایوسی اور زندگی میں دلچسپی کا ختم ہونا۔' },
  'Excessive Worry': { en: 'Chronic, intrusive preoccupation with worst-case outcomes.', ur: 'ہر بات پر ضرورت سے زیادہ فکر اور وہم میں مبتلا رہنا۔' },
  'Irritability': { en: 'Easily annoyed, frustrated, or provoked by minor daily events.', ur: 'معمولی باتوں پر غصہ آنا اور چڑچڑاپن ظاہر ہونا۔' },
  'Restlessness': { en: 'Physical agitation and inability to sit still or relax peacefully.', ur: 'بے سکونی اور بے چینی کے باعث ایک جگہ سکون نہ ملنا۔' },
};

/**
 * Returns a short, medically accurate description for a symptom in English and Urdu.
 *
 * @param name       - Symptom name
 * @param category   - Category name
 * @param customDesc - Optional description from database
 * @returns Object with English and Urdu descriptions
 */
export function getSymptomDescription(
  name: string,
  category: string,
  customDesc?: string | null
): { en: string; ur: string } {
  if (SYMPTOM_DESCRIPTIONS[name]) {
    return SYMPTOM_DESCRIPTIONS[name];
  }

  if (customDesc && customDesc.trim()) {
    const urduName = URDU_SYMPTOMS[name] || name;
    return {
      en: customDesc,
      ur: `${urduName}: ${customDesc}`,
    };
  }

  const urduCat = URDU_CATEGORIES[category] || category;
  const urduSym = URDU_SYMPTOMS[name] || name;

  return {
    en: `Clinical symptom involving the ${category.toLowerCase()} system characterized by ${name.toLowerCase()}.`,
    ur: `${urduCat} کے نظام سے متعلق علامت جس میں ${urduSym} کی کیفیت ظاہر ہوتی ہے۔`,
  };
}
