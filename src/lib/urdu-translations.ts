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
