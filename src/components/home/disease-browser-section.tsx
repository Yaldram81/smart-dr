'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { getDisplayName, URDU_SYMPTOMS, URDU_DISEASES, URDU_CATEGORIES, URDU_SEVERITY, URDU_UI } from '@/lib/urdu-translations'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  ClipboardList, Brain, Thermometer, Wind, Eye, Bone, Droplets,
  Sparkles, HeartPulse, UserCheck, AlertTriangle, CheckCircle2,
  Shield, Pill, Syringe, Apple, Stethoscope, Search, X,
  ChevronDown, ChevronRight, Languages
} from 'lucide-react'
import type { DiseaseDataItem } from '@/components/types'

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'General': <Thermometer className="size-4" />,
  'Respiratory': <Wind className="size-4" />,
  'Digestive': <Apple className="size-4" />,
  'Skin': <Eye className="size-4" />,
  'Musculoskeletal': <Bone className="size-4" />,
  'Neurological': <Brain className="size-4" />,
  'Cardiovascular': <HeartPulse className="size-4" />,
  'ENT': <ClipboardList className="size-4" />,
  'Urinary': <Droplets className="size-4" />,
  'Mental Health': <Sparkles className="size-4" />,
  'Other': <ClipboardList className="size-4" />,
}

const DISEASE_DATA: DiseaseDataItem[] = [
  { name: 'Common Cold', severity: 'mild', category: 'Respiratory', specialist: 'General Physician', description: 'A viral infection of the upper respiratory tract.', symptoms: ['Runny nose', 'Sore throat', 'Cough', 'Congestion', 'Sneezing', 'Mild headache'], precautions: ['Wash hands frequently', 'Avoid close contact with sick individuals', 'Get adequate rest', 'Stay hydrated'], medications: ['Decongestants', 'Cough suppressants', 'Pain relievers (acetaminophen)', 'Antihistamines'], diet: ['Warm soups and broths', 'Honey and lemon tea', 'Vitamin C-rich fruits', 'Plenty of fluids'], workout: ['Light walking for fresh air', 'Gentle stretching exercises', 'Restorative yoga poses', 'Deep breathing exercises', 'Light household activities'] },
  { name: 'Influenza', severity: 'moderate', category: 'Respiratory', specialist: 'General Physician', description: 'A contagious respiratory illness caused by influenza viruses.', symptoms: ['High fever', 'Body aches', 'Fatigue', 'Cough', 'Sore throat', 'Headache'], precautions: ['Annual flu vaccination', 'Avoid crowded places during flu season', 'Practice good hygiene', 'Stay home when sick'], medications: ['Oseltamivir (Tamiflu)', 'Ibuprofen for fever/pain', 'Cough medicine', 'Antiviral medications'], diet: ['Chicken soup', 'Garlic and ginger', 'Leafy green vegetables', 'Citrus fruits'], workout: ['Complete bed rest during acute phase', 'Gentle walking after fever subsides', 'Light stretching when recovered', 'Gradual return to normal activity', 'Deep breathing exercises'] },
  { name: 'Pneumonia', severity: 'severe', category: 'Respiratory', specialist: 'Pulmonologist', description: 'An infection that inflames the air sacs in one or both lungs.', symptoms: ['Chest pain', 'Difficulty breathing', 'Productive cough', 'Fever', 'Chills', 'Fatigue'], precautions: ['Get pneumococcal vaccination', 'Practice deep breathing exercises', 'Avoid smoking', 'Seek medical attention promptly'], medications: ['Antibiotics (for bacterial)', 'Antiviral drugs', 'Fever reducers', 'Cough medicine'], diet: ['High-protein foods', 'Warm fluids', 'Vitamin A and C rich foods', 'Avoid dairy if it increases phlegm'], workout: ['Deep breathing exercises', 'Gentle walking after fever subsides', 'Incentive spirometry exercises', 'Light stretching during recovery', 'Gradual cardiovascular conditioning'] },
  { name: 'Bronchitis', severity: 'moderate', category: 'Respiratory', specialist: 'Pulmonologist', description: 'Inflammation of the lining of bronchial tubes.', symptoms: ['Persistent cough', 'Mucus production', 'Chest discomfort', 'Fatigue', 'Shortness of breath'], precautions: ['Avoid smoking and secondhand smoke', 'Use a humidifier', 'Wear a mask in polluted areas', 'Stay hydrated'], medications: ['Bronchodilators', 'Expectorants', 'Anti-inflammatory drugs', 'Cough suppressants'], diet: ['Honey and warm water', 'Ginger tea', 'Turmeric milk', 'Omega-3 rich foods'], workout: ['Gentle breathing exercises', 'Light walking when symptoms improve', 'Controlled coughing techniques', 'Gradual return to aerobic activity', 'Avoid cold air and strenuous exercise'] },
  { name: 'Asthma', severity: 'moderate', category: 'Respiratory', specialist: 'Pulmonologist', description: 'A condition in which airways narrow and swell.', symptoms: ['Wheezing', 'Shortness of breath', 'Chest tightness', 'Coughing', 'Difficulty sleeping due to breathing issues'], precautions: ['Identify and avoid triggers', 'Keep rescue inhaler accessible', 'Follow asthma action plan', 'Monitor peak flow regularly'], medications: ['Inhaled corticosteroids', 'Long-acting beta agonists', 'Leukotriene modifiers', 'Rescue inhalers (albuterol)'], diet: ['Anti-inflammatory foods', 'Omega-3 fatty acids', 'Fruits and vegetables', 'Avoid sulfite-containing foods'], workout: ['Gentle breathing exercises', 'Walking in clean air environments', 'Swimming in warm indoor pools', 'Yoga with focus on breath control', 'Avoid cold weather and high-intensity exercise'] },
  { name: 'Tuberculosis', severity: 'severe', category: 'Respiratory', specialist: 'Pulmonologist', description: 'A serious infectious disease affecting the lungs.', symptoms: ['Persistent cough (3+ weeks)', 'Coughing up blood', 'Night sweats', 'Weight loss', 'Fever', 'Fatigue'], precautions: ['Complete full course of medication', 'Isolate during active phase', 'Ensure good ventilation', 'Wear a mask around others'], medications: ['Isoniazid', 'Rifampin', 'Ethambutol', 'Pyrazinamide'], diet: ['High-calorie nutritious diet', 'Protein-rich foods', 'Vitamin B6 supplements', 'Fresh fruits and vegetables'], workout: ['Gentle walking in fresh air', 'Deep breathing exercises', 'Light stretching and mobility work', 'Gradual strength building during recovery', 'Avoid strenuous activity during treatment'] },
  { name: 'Gastroenteritis', severity: 'moderate', category: 'Digestive', specialist: 'Gastroenterologist', description: 'Inflammation of the stomach and intestines.', symptoms: ['Diarrhea', 'Vomiting', 'Stomach pain', 'Nausea', 'Fever', 'Dehydration'], precautions: ['Practice good hand hygiene', 'Avoid contaminated food and water', 'Stay hydrated with ORS', 'Rest the stomach'], medications: ['Oral rehydration salts', 'Anti-diarrheal medication', 'Anti-nausea drugs', 'Probiotics'], diet: ['BRAT diet (Bananas, Rice, Applesauce, Toast)', 'Clear broths', 'Coconut water', 'Avoid dairy and fatty foods'], workout: ['Complete rest during acute phase', 'Gentle walking after vomiting stops', 'Light stretching during recovery', 'Gradual return to activity', 'Avoid strenuous exercise until hydrated'] },
  { name: 'GERD', severity: 'mild', category: 'Digestive', specialist: 'Gastroenterologist', description: 'A chronic digestive disease where stomach acid flows back.', symptoms: ['Heartburn', 'Acid reflux', 'Difficulty swallowing', 'Chest pain', 'Regurgitation'], precautions: ['Avoid lying down after eating', 'Elevate head while sleeping', 'Eat smaller meals', 'Avoid trigger foods'], medications: ['Proton pump inhibitors', 'H2 receptor blockers', 'Antacids', 'Prokinetics'], diet: ['Low-acid foods', 'Lean proteins', 'Whole grains', 'Avoid spicy, fatty, and acidic foods'], workout: ['Light walking after meals', 'Gentle yoga avoiding inversions', 'Low-impact aerobic exercises', 'Avoid exercises lying flat after eating', 'Upright cycling at moderate pace'] },
  { name: 'Peptic Ulcer', severity: 'moderate', category: 'Digestive', specialist: 'Gastroenterologist', description: 'Painful sores in the stomach lining or small intestine.', symptoms: ['Burning stomach pain', 'Bloating', 'Heartburn', 'Nausea', 'Dark or black stools'], precautions: ['Avoid NSAIDs', 'Limit alcohol consumption', 'Quit smoking', 'Manage stress levels'], medications: ['Proton pump inhibitors', 'H2 blockers', 'Antibiotics (for H. pylori)', 'Antacids'], diet: ['Fiber-rich foods', 'Probiotics', 'Vitamin A-rich foods', 'Avoid spicy and acidic foods'], workout: ['Light walking for digestion', 'Gentle yoga avoiding abdominal strain', 'Low-impact aerobic exercises', 'Stress-reducing activities like tai chi', 'Avoid high-intensity exercise on empty stomach'] },
  { name: 'Irritable Bowel Syndrome', severity: 'moderate', category: 'Digestive', specialist: 'Gastroenterologist', description: 'A chronic disorder affecting the large intestine.', symptoms: ['Abdominal pain', 'Bloating', 'Diarrhea or constipation', 'Gas', 'Mucus in stool'], precautions: ['Follow a low-FODMAP diet', 'Manage stress', 'Exercise regularly', 'Keep a food diary'], medications: ['Antispasmodics', 'Fiber supplements', 'Laxatives or anti-diarrheals', 'Antidepressants (low dose)'], diet: ['Soluble fiber foods', 'Low-FODMAP diet', 'Peppermint tea', 'Avoid gas-producing foods'], workout: ['Gentle walking after meals', 'Yoga for stress reduction', 'Low-impact aerobic exercises', 'Swimming at comfortable pace', 'Avoid high-intensity workouts during flare-ups'] },
  { name: 'Hepatitis', severity: 'severe', category: 'Digestive', specialist: 'Hepatologist', description: 'Inflammation of the liver caused by viruses or other factors.', symptoms: ['Jaundice', 'Fatigue', 'Abdominal pain', 'Loss of appetite', 'Dark urine', 'Nausea'], precautions: ['Get vaccinated (Hep A & B)', 'Avoid sharing needles', 'Practice safe food handling', 'Limit alcohol intake'], medications: ['Antiviral medications', 'Interferon therapy', 'Liver protectants', 'Immune modulators'], diet: ['Low-sodium foods', 'Lean proteins', 'Whole grains', 'Avoid alcohol and processed foods'], workout: ['Complete rest during acute phase', 'Gentle walking during recovery', 'Light stretching exercises', 'Gradual return to moderate activity', 'Avoid alcohol and strenuous exercise'] },
  { name: 'Migraine', severity: 'moderate', category: 'Neurological', specialist: 'Neurologist', description: 'A headache that can cause severe throbbing pain.', symptoms: ['Severe headache', 'Nausea', 'Sensitivity to light and sound', 'Visual disturbances', 'Dizziness'], precautions: ['Identify and avoid triggers', 'Maintain regular sleep schedule', 'Stay hydrated', 'Manage stress'], medications: ['Triptans', 'NSAIDs', 'Anti-nausea drugs', 'Preventive medications (beta-blockers)'], diet: ['Magnesium-rich foods', 'Riboflavin sources', 'Regular meals to avoid low blood sugar', 'Avoid aged cheese and processed meats'], workout: ['Gentle walking during symptom-free periods', 'Yoga and relaxation exercises', 'Light stretching and neck exercises', 'Low-impact aerobic activity', 'Avoid high-intensity exercise during attacks'] },
  { name: 'Epilepsy', severity: 'severe', category: 'Neurological', specialist: 'Neurologist', description: 'A neurological disorder causing recurrent seizures.', symptoms: ['Seizures', 'Loss of consciousness', 'Confusion', 'Uncontrollable jerking movements', 'Staring spells'], precautions: ['Take medications as prescribed', 'Get adequate sleep', 'Avoid alcohol', 'Wear a medical alert bracelet'], medications: ['Antiepileptic drugs (levetiracetam)', 'Valproic acid', 'Carbamazepine', 'Lamotrigine'], diet: ['Ketogenic diet (under medical supervision)', 'Regular balanced meals', 'Vitamin D supplements', 'Avoid skipping meals'], workout: ['Regular moderate exercise like walking', 'Swimming with supervision only', 'Yoga and tai chi for stress reduction', 'Avoid extreme sports and heights', 'Consistent exercise routine to reduce seizure frequency'] },
  { name: 'Meningitis', severity: 'severe', category: 'Neurological', specialist: 'Neurologist', description: 'Inflammation of the membranes surrounding the brain and spinal cord.', symptoms: ['Severe headache', 'High fever', 'Stiff neck', 'Sensitivity to light', 'Confusion', 'Rash'], precautions: ['Get vaccinated', 'Seek emergency care immediately', 'Avoid close contact with infected individuals', 'Practice good hygiene'], medications: ['Intravenous antibiotics', 'Corticosteroids', 'Anticonvulsants', 'Pain relievers'], diet: ['Soft, easy-to-digest foods during recovery', 'Plenty of fluids', 'Vitamin C-rich foods', 'High-protein diet for recovery'], workout: ['Complete bed rest during acute illness', 'Gentle walking during recovery', 'Gradual return to activity', 'Physical therapy if needed for recovery', 'Avoid strenuous exercise until fully recovered'] },
  { name: 'Stroke', severity: 'severe', category: 'Neurological', specialist: 'Neurologist', description: 'A medical emergency when blood supply to the brain is interrupted.', symptoms: ['Face drooping', 'Arm weakness', 'Speech difficulty', 'Sudden severe headache', 'Vision problems', 'Balance issues'], precautions: ['Control blood pressure', 'Quit smoking', 'Manage diabetes', 'Exercise regularly'], medications: ['tPA (clot dissolver)', 'Antiplatelet drugs', 'Anticoagulants', 'Blood pressure medications'], diet: ['Low-sodium diet', 'Mediterranean diet', 'Fruits and vegetables', 'Omega-3 fatty acids from fish'], workout: ['Rehabilitation exercises as prescribed', 'Gentle walking with assistance', 'Range-of-motion exercises for affected limbs', 'Balance and coordination training', 'Gradual return to supervised activity'] },
  { name: 'Parkinson\'s Disease', severity: 'severe', category: 'Neurological', specialist: 'Neurologist', description: 'A progressive nervous system disorder affecting movement.', symptoms: ['Tremors', 'Bradykinesia', 'Muscle rigidity', 'Postural instability', 'Speech changes'], precautions: ['Exercise regularly', 'Prevent falls', 'Join support groups', 'Follow medication schedule strictly'], medications: ['Levodopa/Carbidopa', 'Dopamine agonists', 'MAO-B inhibitors', 'Physical therapy'], diet: ['High-fiber foods', 'Adequate hydration', 'Protein timing with medications', 'Vitamin D and calcium supplements'], workout: ['Regular walking for mobility', 'Tai chi for balance improvement', 'Gentle stretching for rigidity', 'Stationary cycling for cardiovascular health', 'Dance therapy for movement coordination'] },
  { name: 'Hypertension', severity: 'moderate', category: 'Cardiovascular', specialist: 'Cardiologist', description: 'Abnormally high blood pressure.', symptoms: ['Often asymptomatic', 'Headaches', 'Dizziness', 'Shortness of breath', 'Nosebleeds'], precautions: ['Monitor blood pressure regularly', 'Reduce sodium intake', 'Exercise regularly', 'Manage stress'], medications: ['ACE inhibitors', 'Beta-blockers', 'Diuretics', 'Calcium channel blockers'], diet: ['DASH diet', 'Low-sodium foods', 'Potassium-rich foods', 'Limit alcohol and caffeine'], workout: ['Brisk walking 30 minutes daily', 'Swimming or water aerobics', 'Light jogging at moderate pace', 'Cycling on flat terrain', 'Tai chi for stress reduction'] },
  { name: 'Heart Disease', severity: 'severe', category: 'Cardiovascular', specialist: 'Cardiologist', description: 'Various conditions affecting the heart structure and function.', symptoms: ['Chest pain', 'Shortness of breath', 'Fatigue', 'Irregular heartbeat', 'Swelling in legs'], precautions: ['Quit smoking', 'Exercise regularly', 'Control cholesterol', 'Manage blood pressure'], medications: ['Statins', 'Beta-blockers', 'ACE inhibitors', 'Blood thinners'], diet: ['Heart-healthy Mediterranean diet', 'Low saturated fat', 'Whole grains', 'Omega-3 rich fish'], workout: ['Cardiac rehabilitation exercises as prescribed', 'Gentle walking on flat ground', 'Light stationary cycling', 'Gradual progressive aerobic activity', 'Avoid heavy exertion and cold weather exercise'] },
  { name: 'Diabetes', severity: 'moderate', category: 'Endocrine', specialist: 'Endocrinologist', description: 'A metabolic disease causing high blood sugar levels.', symptoms: ['Increased thirst', 'Frequent urination', 'Unexplained weight loss', 'Fatigue', 'Blurred vision'], precautions: ['Monitor blood sugar regularly', 'Follow meal plan', 'Exercise regularly', 'Foot care'], medications: ['Metformin', 'Insulin therapy', 'Sulfonylureas', 'GLP-1 receptor agonists'], diet: ['Low glycemic index foods', 'Complex carbohydrates', 'High-fiber diet', 'Avoid sugary drinks and refined carbs'], workout: ['Brisk walking 30 minutes daily', 'Swimming or water aerobics', 'Cycling at moderate pace', 'Resistance training 2-3 times per week', 'Yoga for stress and blood sugar management'] },
  { name: 'Hypothyroidism', severity: 'mild', category: 'Endocrine', specialist: 'Endocrinologist', description: 'An underactive thyroid gland producing too little hormone.', symptoms: ['Fatigue', 'Weight gain', 'Cold intolerance', 'Dry skin', 'Constipation'], precautions: ['Take medication consistently', 'Regular thyroid function tests', 'Avoid soy near medication time', 'Manage stress'], medications: ['Levothyroxine', 'Liothyronine', 'Natural desiccated thyroid', 'Regular dose monitoring'], diet: ['Iodine-rich foods', 'Selenium sources', 'Zinc-rich foods', 'Avoid excessive cruciferous vegetables raw'], workout: ['Brisk walking 30 minutes daily', 'Strength training to boost metabolism', 'Yoga for energy and stress management', 'Swimming or water aerobics', 'Gradual progressive exercise routine'] },
  { name: 'Hyperthyroidism', severity: 'moderate', category: 'Endocrine', specialist: 'Endocrinologist', description: 'An overactive thyroid gland producing too much hormone.', symptoms: ['Weight loss', 'Rapid heartbeat', 'Anxiety', 'Tremors', 'Heat intolerance', 'Increased appetite'], precautions: ['Regular monitoring', 'Avoid iodine excess', 'Manage stress', 'Follow treatment plan'], medications: ['Methimazole', 'Propylthiouracil', 'Beta-blockers', 'Radioactive iodine therapy'], diet: ['Calcium-rich foods', 'Vitamin D sources', 'Avoid iodine supplements', 'Balanced diet with adequate calories'], workout: ['Low-intensity walking', 'Gentle yoga and stretching', 'Swimming at relaxed pace', 'Avoid high-intensity cardiovascular exercise', 'Stress-reducing activities like tai chi'] },
  { name: 'Dengue Fever', severity: 'severe', category: 'Infectious', specialist: 'Infectious Disease Specialist', description: 'A mosquito-borne viral disease causing flu-like illness.', symptoms: ['High fever', 'Severe headache', 'Joint and muscle pain', 'Rash', 'Fatigue', 'Mild bleeding'], precautions: ['Use mosquito repellent', 'Eliminate standing water', 'Wear long-sleeved clothing', 'Use mosquito nets'], medications: ['Acetaminophen (avoid aspirin)', 'IV fluids for severe cases', 'Pain relievers', 'Platelet transfusion if needed'], diet: ['Papaya leaf juice', 'Coconut water', 'Vitamin C-rich foods', 'Plenty of fluids and ORS'], workout: ['Complete rest during acute phase', 'Gentle walking only after recovery', 'Light stretching exercises', 'Gradual return to activity', 'Avoid strenuous exercise for weeks'] },
  { name: 'Malaria', severity: 'severe', category: 'Infectious', specialist: 'Infectious Disease Specialist', description: 'A serious mosquito-borne disease caused by parasites.', symptoms: ['High fever with chills', 'Sweating', 'Headache', 'Nausea and vomiting', 'Body aches'], precautions: ['Use mosquito nets', 'Take antimalarial prophylaxis when traveling', 'Use insect repellent', 'Wear protective clothing'], medications: ['Artemisinin-based combination therapy', 'Chloroquine', 'Quinine', 'Primaquine'], diet: ['High-protein diet', 'Iron-rich foods', 'Vitamin C for iron absorption', 'Plenty of fluids'], workout: ['Complete bed rest during fever', 'Gentle walking during recovery', 'Light stretching exercises', 'Gradual reintroduction of activity', 'Avoid heavy exertion during treatment'] },
  { name: 'Typhoid', severity: 'severe', category: 'Infectious', specialist: 'Infectious Disease Specialist', description: 'A bacterial infection spread through contaminated food and water.', symptoms: ['Sustained high fever', 'Stomach pain', 'Weakness', 'Loss of appetite', 'Rose-colored rash'], precautions: ['Get vaccinated', 'Drink clean/boiled water', 'Avoid street food in endemic areas', 'Practice good hygiene'], medications: ['Antibiotics (azithromycin)', 'Ciprofloxacin', 'Ceftriaxone', 'Oral rehydration therapy'], diet: ['Bland, easy-to-digest foods', 'Boiled vegetables', 'Rice and lentils', 'Avoid raw foods and dairy'], workout: ['Complete rest during acute illness', 'Gentle walking after fever resolves', 'Light stretching exercises', 'Gradual return to daily activities', 'Avoid strenuous activity during recovery'] },
  { name: 'Chickenpox', severity: 'mild', category: 'Infectious', specialist: 'Dermatologist', description: 'A highly contagious viral infection causing itchy rashes.', symptoms: ['Itchy rash', 'Fever', 'Fatigue', 'Loss of appetite', 'Headache'], precautions: ['Get vaccinated', 'Avoid scratching blisters', 'Isolate until all lesions crust', 'Keep nails short'], medications: ['Acetaminophen for fever', 'Calamine lotion', 'Antiviral drugs (high-risk cases)', 'Antihistamines for itching'], diet: ['Soft, bland foods', 'Plenty of fluids', 'Vitamin C-rich foods', 'Avoid spicy and acidic foods'], workout: ['Complete rest during active infection', 'Gentle walking after fever resolves', 'Light stretching during recovery', 'Avoid contact sports until fully healed', 'Gradual return to normal activity'] },
  { name: 'Dermatitis', severity: 'mild', category: 'Skin', specialist: 'Dermatologist', description: 'A condition causing skin inflammation and irritation.', symptoms: ['Red, itchy skin', 'Dry, cracked skin', 'Swelling', 'Blisters', 'Scaling'], precautions: ['Identify and avoid triggers', 'Keep skin moisturized', 'Use mild soaps', 'Avoid extreme temperatures'], medications: ['Topical corticosteroids', 'Antihistamines', 'Moisturizers/emollients', 'Calcineurin inhibitors'], diet: ['Anti-inflammatory foods', 'Omega-3 fatty acids', 'Probiotics', 'Avoid common allergens'], workout: ['Gentle yoga and stretching', 'Walking in cool environments', 'Low-impact aerobics', 'Swimming in chlorinated pools with post-rinse', 'Avoid sweating excessively and hot environments'] },
  { name: 'Arthritis', severity: 'moderate', category: 'Musculoskeletal', specialist: 'Rheumatologist', description: 'Inflammation of one or more joints causing pain and stiffness.', symptoms: ['Joint pain', 'Stiffness', 'Swelling', 'Reduced range of motion', 'Warmth around joints'], precautions: ['Exercise regularly', 'Maintain healthy weight', 'Protect joints during activities', 'Apply hot/cold therapy'], medications: ['NSAIDs', 'DMARDs', 'Corticosteroids', 'Biologics'], diet: ['Anti-inflammatory foods', 'Omega-3 fatty acids', 'Turmeric and ginger', 'Avoid processed foods and excess sugar'], workout: ['Low-impact swimming', 'Range-of-motion exercises', 'Gentle yoga or tai chi', 'Stationary cycling', 'Water aerobics for joint mobility'] },
  { name: 'Cholera', severity: 'severe', category: 'Infectious', specialist: 'Infectious Disease Specialist', description: 'An acute diarrheal disease caused by Vibrio cholerae bacteria through contaminated water and food.', symptoms: ['Severe watery diarrhea', 'Vomiting', 'Dehydration', 'Rapid heart rate', 'Low blood pressure', 'Dry mouth', 'Muscle cramps', 'Sunken eyes'], precautions: ['Drink only boiled or treated water', 'Practice good hygiene and handwashing', 'Avoid raw or undercooked seafood', 'Use proper sanitation facilities', 'Get vaccinated when traveling to endemic areas'], medications: ['Oral rehydration salts (ORS)', 'Intravenous fluids', 'Doxycycline', 'Azithromycin', 'Zinc supplementation'], diet: ['Rice-based oral rehydration solution', 'Bland foods like rice and bananas', 'Plenty of safe fluids', 'Avoid dairy and fatty foods'], workout: ['Complete bed rest during acute illness', 'Gentle movement when dehydration resolves', 'Light walking during recovery', 'Gradual return to normal activity', 'Avoid strenuous exercise until fully hydrated'] },
  { name: 'Food Poisoning', severity: 'moderate', category: 'Digestive', specialist: 'Gastroenterologist', description: 'An illness caused by eating contaminated food containing bacteria, viruses, or parasites.', symptoms: ['Nausea', 'Vomiting', 'Diarrhea', 'Abdominal pain', 'Fever', 'Weakness', 'Loss of appetite', 'Headache'], precautions: ['Practice proper food handling and storage', 'Cook meat thoroughly', 'Wash hands before preparing food', 'Avoid expired or improperly stored food', 'Refrigerate perishables promptly'], medications: ['Anti-diarrheal medication (loperamide)', 'Oral rehydration salts', 'Anti-nausea drugs (ondansetron)', 'Bismuth subsalicylate'], diet: ['Clear broths and soups', 'BRAT diet', 'Plenty of fluids', 'Avoid dairy and fatty foods'], workout: ['Complete rest during acute symptoms', 'Gentle walking after vomiting stops', 'Light stretching during recovery', 'Gradual return to normal activity', 'Avoid strenuous exercise until fully hydrated'] },
  { name: 'Appendicitis', severity: 'severe', category: 'Digestive', specialist: 'General Surgeon', description: 'An inflammation of the appendix requiring urgent surgical removal to prevent rupture.', symptoms: ['Right lower abdominal pain', 'Nausea', 'Vomiting', 'Fever', 'Loss of appetite', 'Abdominal tenderness', 'Pain with movement', 'Bloating'], precautions: ['Seek immediate medical attention for right-sided abdominal pain', 'Do not eat or drink if appendicitis suspected', 'Avoid laxatives or painkillers before diagnosis', 'Follow post-surgical care instructions'], medications: ['Intravenous antibiotics', 'Pain relievers post-surgery', 'Anti-nausea medication', 'Ceftriaxone and metronidazole'], diet: ['Clear liquids post-surgery', 'Gradually advance to soft foods', 'High-fiber foods during recovery', 'Avoid heavy, greasy meals during healing'], workout: ['Complete rest before and after surgery', 'Gentle walking post-surgery as advised', 'Gradual return to light activity', 'Avoid heavy lifting for 4-6 weeks post-surgery', 'Core-strengthening exercises after full recovery'] },
  { name: 'Gallstones', severity: 'moderate', category: 'Digestive', specialist: 'Gastroenterologist', description: 'Hardened deposits of digestive fluid that form in the gallbladder, blocking bile ducts.', symptoms: ['Right upper abdominal pain', 'Nausea', 'Vomiting', 'Bloating', 'Indigestion', 'Jaundice', 'Back pain', 'Clay-colored stools'], precautions: ['Maintain a healthy weight', 'Avoid rapid weight loss', 'Eat a balanced diet with healthy fats', 'Exercise regularly', 'Avoid skipping meals'], medications: ['Ursodeoxycholic acid', 'Pain relievers (ibuprofen)', 'Antispasmodics', 'Antibiotics if infection present'], diet: ['Low-fat diet', 'High-fiber foods', 'Lean proteins', 'Avoid fried and greasy foods'], workout: ['Light walking for digestion', 'Gentle yoga avoiding twists', 'Low-impact aerobic exercises', 'Gradual return to normal activity post-surgery', 'Avoid heavy lifting after gallbladder surgery'] },
  { name: 'Osteoporosis', severity: 'moderate', category: 'Musculoskeletal', specialist: 'Endocrinologist', description: 'A bone disease where bone mineral density decreases, leading to weakened bones and fracture risk.', symptoms: ['Back pain', 'Loss of height', 'Stooped posture', 'Bone fractures', 'Weakness', 'Joint pain', 'Difficulty standing'], precautions: ['Ensure adequate calcium and vitamin D intake', 'Do weight-bearing exercises regularly', 'Avoid smoking and excessive alcohol', 'Prevent falls at home', 'Get regular bone density screenings'], medications: ['Bisphosphonates (alendronate)', 'Calcium supplements', 'Vitamin D supplements', 'Denosumab'], diet: ['Calcium-rich foods (dairy, leafy greens)', 'Vitamin D sources (fatty fish)', 'Protein-rich foods', 'Limit sodium and caffeine'], workout: ['Weight-bearing walking exercises', 'Gentle resistance training', 'Tai chi for balance and fall prevention', 'Low-impact aerobics', 'Avoid high-impact and twisting movements'] },
  { name: 'Gout', severity: 'moderate', category: 'Musculoskeletal', specialist: 'Rheumatologist', description: 'Inflammatory arthritis caused by excess uric acid crystallization in joints, typically the big toe.', symptoms: ['Severe joint pain', 'Joint swelling', 'Redness around joint', 'Joint warmth', 'Tenderness', 'Limited range of motion', 'Skin peeling around joint'], precautions: ['Limit purine-rich foods', 'Stay hydrated', 'Avoid excessive alcohol especially beer', 'Maintain healthy weight', 'Exercise regularly'], medications: ['Colchicine', 'Allopurinol', 'Indomethacin', 'Prednisone', 'Febuxostat'], diet: ['Low-purine diet', 'Cherries and cherry juice', 'Plenty of water', 'Avoid red meat, organ meats, and shellfish'], workout: ['Gentle walking during symptom-free periods', 'Range-of-motion exercises for affected joints', 'Swimming for low-impact cardiovascular health', 'Stationary cycling', 'Avoid high-impact exercise during flare-ups'] },
  { name: 'Glaucoma', severity: 'moderate', category: 'Eyes', specialist: 'Ophthalmologist', description: 'Eye conditions that damage the optic nerve, often caused by abnormally high pressure in the eye.', symptoms: ['Gradual peripheral vision loss', 'Blurred vision', 'Eye pain', 'Headache', 'Halos around lights', 'Red eyes', 'Tunnel vision'], precautions: ['Get regular eye exams especially after age 40', 'Use prescribed eye drops consistently', 'Protect eyes from UV radiation', 'Exercise regularly', 'Avoid excessive caffeine'], medications: ['Latanoprost eye drops', 'Timolol eye drops', 'Brimonidine eye drops', 'Acetazolamide'], diet: ['Leafy green vegetables', 'Omega-3 fatty acids', 'Vitamin A and C rich foods', 'Limit caffeine intake'], workout: ['Regular moderate walking', 'Gentle yoga avoiding head-down positions', 'Stationary cycling at light intensity', 'Low-impact aerobics', 'Avoid exercises that increase intraocular pressure'] },
  { name: 'Cataracts', severity: 'mild', category: 'Eyes', specialist: 'Ophthalmologist', description: 'A clouding of the eye lens leading to decreased vision, most common in people over 40.', symptoms: ['Cloudy vision', 'Difficulty seeing at night', 'Sensitivity to light', 'Faded colors', 'Double vision', 'Frequent prescription changes', 'Halos around lights', 'Blurred vision'], precautions: ['Wear sunglasses to block UV rays', 'Quit smoking', 'Manage diabetes and other health conditions', 'Eat a healthy diet rich in antioxidants', 'Get regular eye examinations'], medications: ['Prescription eyeglasses for early stages', 'Cataract surgery', 'Intraocular lens implant', 'Anti-inflammatory eye drops post-surgery'], diet: ['Vitamin C rich foods', 'Vitamin E sources', 'Lutein and zeaxanthin rich foods', 'Omega-3 fatty acids'], workout: ['Light walking and gentle exercises', 'Stationary cycling', 'Low-impact aerobics pre-surgery', 'Gradual return to activity post-surgery', 'Avoid heavy lifting after cataract surgery'] },
  { name: 'Anxiety Disorder', severity: 'moderate', category: 'Psychological', specialist: 'Psychiatrist', description: 'A mental health condition characterized by excessive, persistent worry and fear about everyday situations.', symptoms: ['Excessive worry', 'Restlessness', 'Rapid heartbeat', 'Difficulty concentrating', 'Muscle tension', 'Insomnia', 'Irritability', 'Sweating', 'Shortness of breath'], precautions: ['Practice relaxation techniques', 'Exercise regularly', 'Limit caffeine and alcohol', 'Maintain a consistent sleep schedule', 'Seek therapy or counseling'], medications: ['Sertraline', 'Escitalopram', 'Buspirone', 'Benzodiazepines (short-term)', 'Venlafaxine'], diet: ['Complex carbohydrates', 'Omega-3 fatty acids', 'Magnesium-rich foods', 'Chamomile tea', 'Limit caffeine and sugar'], workout: ['Brisk walking or jogging', 'Yoga and mindfulness exercises', 'Swimming for rhythmic calming effect', 'Deep breathing exercises', 'Progressive muscle relaxation techniques'] },
  { name: 'Insomnia', severity: 'mild', category: 'Psychological', specialist: 'Sleep Specialist', description: 'A sleep disorder characterized by difficulty falling or staying asleep, impacting daily functioning.', symptoms: ['Difficulty falling asleep', 'Waking up during night', 'Daytime fatigue', 'Irritability', 'Difficulty concentrating', 'Anxiety', 'Headache', 'Depression'], precautions: ['Maintain a consistent sleep schedule', 'Create a comfortable sleep environment', 'Limit screen time before bed', 'Avoid caffeine and heavy meals late in the day', 'Exercise regularly but not close to bedtime'], medications: ['Melatonin', 'Zolpidem (short-term)', 'Diphenhydramine', 'Trazodone', 'Cognitive Behavioral Therapy for Insomnia'], diet: ['Tart cherry juice', 'Herbal teas (chamomile, valerian)', 'Magnesium-rich foods', 'Complex carbohydrates at dinner'], workout: ['Morning aerobic exercise like walking', 'Gentle evening yoga or stretching', 'Avoid vigorous exercise close to bedtime', 'Tai chi for relaxation', 'Regular exercise schedule at consistent times'] },
  { name: 'Celiac Disease', severity: 'moderate', category: 'Digestive', specialist: 'Gastroenterologist', description: 'An autoimmune disorder where gluten damages the small intestine lining, causing nutrient malabsorption.', symptoms: ['Diarrhea', 'Bloating', 'Abdominal pain', 'Fatigue', 'Weight loss', 'Anemia symptoms', 'Skin rash', 'Constipation', 'Joint pain', 'Mouth ulcers'], precautions: ['Follow a strict gluten-free diet', 'Read food labels carefully', 'Avoid cross-contamination in kitchen', 'Check medications for gluten content', 'Get regular nutritional screenings'], medications: ['Gluten-free diet (primary treatment)', 'Vitamin and mineral supplements', 'Corticosteroids for severe cases', 'Iron supplements for anemia'], diet: ['Naturally gluten-free grains (rice, quinoa)', 'Fresh fruits and vegetables', 'Lean proteins', 'Avoid wheat, barley, rye'], workout: ['Brisk walking for digestive health', 'Gentle yoga for stress management', 'Swimming or water aerobics', 'Light resistance training', 'Gradual increase in activity as nutrient absorption improves'] },
  { name: 'Psoriasis', severity: 'moderate', category: 'Skin', specialist: 'Dermatologist', description: 'A chronic autoimmune condition causing rapid skin cell buildup, scaling, and inflammation.', symptoms: ['Red skin patches', 'Silvery scales', 'Itchy skin', 'Dry cracked skin', 'Joint pain', 'Nail pitting', 'Skin burning', 'Thickened nails'], precautions: ['Moisturize skin regularly', 'Avoid triggers like stress and cold weather', 'Limit alcohol consumption', 'Avoid skin injuries and infections', 'Use gentle skincare products'], medications: ['Topical corticosteroids', 'Vitamin D analogues (calcipotriene)', 'Methotrexate', 'Biologics (adalimumab, etanercept)', 'Phototherapy (UVB)'], diet: ['Anti-inflammatory foods', 'Omega-3 fatty acids', 'Gluten-free diet (if sensitive)', 'Vitamin D rich foods'], workout: ['Gentle yoga and stretching', 'Swimming in salt water or chlorinated pools', 'Walking in comfortable clothing', 'Low-impact aerobics', 'Avoid activities causing excessive sweating and friction'] },
  { name: 'Lupus', severity: 'severe', category: 'Autoimmune', specialist: 'Rheumatologist', description: 'A chronic autoimmune disease where the immune system attacks healthy tissue in multiple organ systems.', symptoms: ['Butterfly rash on face', 'Joint pain', 'Fatigue', 'Fever', 'Skin rash', 'Photosensitivity', 'Hair loss', 'Chest pain', 'Kidney problems', 'Mouth ulcers'], precautions: ['Avoid excessive sun exposure', 'Get regular medical check-ups', 'Manage stress levels', 'Take medications as prescribed', 'Stay physically active within limits'], medications: ['Hydroxychloroquine', 'Prednisone', 'Mycophenolate mofetil', 'Azathioprine', 'Belimumab'], diet: ['Anti-inflammatory foods', 'Omega-3 fatty acids', 'Vitamin D and calcium supplements', 'Low-sodium diet'], workout: ['Gentle walking during low-activity periods', 'Range-of-motion exercises', 'Swimming in heated pools', 'Tai chi for joint flexibility', 'Pace activities to avoid fatigue flares'] },
  { name: 'Fibromyalgia', severity: 'moderate', category: 'Musculoskeletal', specialist: 'Rheumatologist', description: 'A chronic condition with widespread musculoskeletal pain, fatigue, sleep and mood issues.', symptoms: ['Widespread body pain', 'Fatigue', 'Sleep disturbances', 'Cognitive difficulties', 'Headache', 'Depression', 'Anxiety', 'Tingling in hands/feet', 'Irritable bowel symptoms'], precautions: ['Exercise regularly with low-impact activities', 'Manage stress through relaxation techniques', 'Maintain consistent sleep habits', 'Pace activities to avoid overexertion', 'Seek support from family and support groups'], medications: ['Pregabalin', 'Duloxetine', 'Milnacipran', 'Amitriptyline', 'Cyclobenzaprine for sleep'], diet: ['Anti-inflammatory foods', 'Omega-3 fatty acids', 'Magnesium-rich foods', 'Limit processed foods and sugar'], workout: ['Gentle walking at comfortable pace', 'Warm water aerobics', 'Yoga with gentle stretching', 'Tai chi for pain management', 'Start with short sessions and gradually increase duration'] },
]

export function DiseaseBrowserSection() {
  const [selectedDisease, setSelectedDisease] = useState<typeof DISEASE_DATA[0] | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({})
  const router = useRouter()
  const { language, setLanguage } = useAppStore()

  const categories = useMemo(() => {
    const cats: Record<string, typeof DISEASE_DATA> = {}
    for (const d of DISEASE_DATA) {
      if (!cats[d.category]) cats[d.category] = []
      cats[d.category].push(d)
    }
    return cats
  }, [])

  const categoryNames = useMemo(() => ['All', ...Object.keys(categories)], [categories])

  const filteredCategories = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    const filtered: Record<string, typeof DISEASE_DATA> = {}

    for (const [category, diseases] of Object.entries(categories)) {
      if (selectedCategory !== 'All' && category !== selectedCategory) continue

      const matchingDiseases = diseases.filter((d) => {
        if (!query) return true
        const eng = d.name.toLowerCase()
        const urd = (URDU_DISEASES[d.name] || '').toLowerCase()
        return eng.includes(query) || urd.includes(query)
      })

      if (matchingDiseases.length > 0) {
        filtered[category] = matchingDiseases
      }
    }

    return filtered
  }, [categories, searchQuery, selectedCategory])

  const totalFiltered = useMemo(() =>
    Object.values(filteredCategories).reduce((sum, diseases) => sum + diseases.length, 0),
    [filteredCategories]
  )

  const toggleCategory = (cat: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [cat]: prev[cat] === undefined ? false : !prev[cat]
    }))
  }

  const expandAll = () => {
    const all: Record<string, boolean> = {}
    for (const cat of Object.keys(filteredCategories)) {
      all[cat] = true
    }
    setOpenCategories(all)
  }

  const collapseAll = () => {
    const none: Record<string, boolean> = {}
    for (const cat of Object.keys(filteredCategories)) {
      none[cat] = false
    }
    setOpenCategories(none)
  }

  const isCategoryOpen = (cat: string) => openCategories[cat] !== false

  const severityColor: Record<string, string> = {
    mild: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    moderate: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    severe: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
  }

  return (
    <section className="py-12 md:py-20 relative overflow-hidden">
      {/* Subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.015] to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <Badge variant="outline" className="border-primary/30 text-primary">Disease Database</Badge>
              {/* Language Switcher Button at Top */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
                className="gap-1.5 h-8 px-3 rounded-full text-xs font-semibold border-primary/30 hover:border-primary bg-background shadow-xs hover:bg-primary/5 transition-all cursor-pointer"
              >
                <Languages className="size-3.5 text-primary" />
                <span>{language === 'en' ? 'اردو زبان (Switch to Urdu)' : 'English Version'}</span>
              </Button>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">Browse Clinical Diseases</h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto text-xs md:text-sm">
              Explore 42+ clinical conditions classified by category. Expand or collapse specialties and click any condition for clinical guidance.
            </p>
          </motion.div>
        </div>
        <div className="max-w-5xl mx-auto">
          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="mb-6 space-y-4"
          >
            {/* Search Input */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={language === 'ur' ? 'بیماری تلاش کریں...' : 'Search diseases by English or Urdu name...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-9 h-10 rounded-xl"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Clear search"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 justify-center">
              {categoryNames.map((cat) => {
                const isActive = selectedCategory === cat
                const catIcon = cat === 'All' ? null : CATEGORY_ICONS[cat]
                return (
                  <Badge
                    key={cat}
                    variant={isActive ? 'default' : 'outline'}
                    className={`cursor-pointer transition-all py-1 px-2.5 text-xs ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-xs'
                        : 'hover:bg-primary/10'
                    }`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {catIcon}
                    <span className="ml-1">{cat === 'All' ? 'All' : getDisplayName(cat, URDU_CATEGORIES[cat] || cat, language)}</span>
                  </Badge>
                )
              })}
            </div>

            {/* Expand / Collapse All & Count Controls */}
            <div className="flex items-center justify-between pt-2 px-1 text-xs text-muted-foreground border-t border-border/40">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={expandAll}
                  className="h-7 text-xs gap-1 px-2 text-muted-foreground hover:text-foreground"
                >
                  <ChevronDown className="size-3.5" />
                  <span>Expand All</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={collapseAll}
                  className="h-7 text-xs gap-1 px-2 text-muted-foreground hover:text-foreground"
                >
                  <ChevronRight className="size-3.5" />
                  <span>Collapse All</span>
                </Button>
              </div>

              <span>
                Showing <strong>{totalFiltered}</strong> of {DISEASE_DATA.length} conditions
              </span>
            </div>
          </motion.div>

          {/* Disease List Classified by Expandable Categories */}
          {totalFiltered === 0 ? (
            <div className="text-center py-12">
              <Search className="size-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-base font-medium">No diseases found</p>
              <p className="text-muted-foreground/70 text-xs mt-1">Try adjusting your search or category filter</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => { setSearchQuery(''); setSelectedCategory('All') }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(filteredCategories).map(([category, diseases]) => {
                const isOpen = isCategoryOpen(category)

                return (
                  <div
                    key={category}
                    className="border border-border/60 rounded-xl bg-card overflow-hidden shadow-2xs transition-all"
                  >
                    {/* Expandable Category Header */}
                    <button
                      type="button"
                      onClick={() => toggleCategory(category)}
                      className="w-full flex items-center justify-between p-3.5 bg-muted/20 hover:bg-muted/40 transition-colors text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-primary">{CATEGORY_ICONS[category] || <ClipboardList className="size-4" />}</span>
                        <h3 className="font-bold text-sm uppercase tracking-wide text-foreground">
                          {getDisplayName(category, URDU_CATEGORIES[category] || category, language)}
                        </h3>
                        <Badge variant="secondary" className="text-[11px] h-5 px-1.5 font-medium">
                          {diseases.length}
                        </Badge>
                      </div>
                      <ChevronDown
                        className={`size-4 text-muted-foreground transition-transform duration-200 ${isOpen ? '' : '-rotate-90'}`}
                      />
                    </button>

                    {/* Small, Compact Disease Cards Grid */}
                    {isOpen && (
                      <div className="p-3 bg-card border-t border-border/40">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                          {diseases.map((disease) => {
                            const urduName = URDU_DISEASES[disease.name]

                            return (
                              <div
                                key={disease.name}
                                onClick={() => setSelectedDisease(disease)}
                                className="p-2.5 rounded-lg border bg-background hover:bg-muted/40 hover:border-primary/50 hover:shadow-2xs transition-all cursor-pointer flex flex-col justify-between gap-1.5 group text-left"
                              >
                                <div className="flex items-start justify-between gap-1.5">
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors truncate">
                                      {disease.name}
                                    </h4>
                                    {urduName && (
                                      <p className="text-[11px] text-muted-foreground font-urdu leading-tight truncate" dir="rtl">
                                        {urduName}
                                      </p>
                                    )}
                                  </div>
                                  <span
                                    className={`size-2 rounded-full shrink-0 mt-1 ${
                                      disease.severity === 'severe'
                                        ? 'bg-red-500 ring-2 ring-red-500/20'
                                        : disease.severity === 'moderate'
                                        ? 'bg-amber-500 ring-2 ring-amber-500/20'
                                        : 'bg-emerald-500 ring-2 ring-emerald-500/20'
                                    }`}
                                    title={`Severity: ${disease.severity}`}
                                  />
                                </div>
                                <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/30">
                                  <span className="truncate max-w-[85px]">{disease.specialist}</span>
                                  <span className="capitalize text-[9px] font-medium opacity-75">{disease.severity}</span>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Disease Detail Modal */}
      <Dialog open={!!selectedDisease} onOpenChange={(open) => { if (!open) setSelectedDisease(null) }}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto custom-scrollbar">
          {selectedDisease && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <HeartPulse className="size-5 text-primary" />
                  {getDisplayName(selectedDisease.name, URDU_DISEASES[selectedDisease.name] || selectedDisease.name, language)}
                </DialogTitle>
                <DialogDescription>{selectedDisease.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className={`border ${severityColor[selectedDisease.severity]}`}>
                    <AlertTriangle className="size-3 mr-1" />
                    {getDisplayName(selectedDisease.severity, URDU_SEVERITY[selectedDisease.severity] || selectedDisease.severity, language)}
                  </Badge>
                  <Badge variant="outline">
                    <ClipboardList className="size-3 mr-1" />
                    {getDisplayName(selectedDisease.category, URDU_CATEGORIES[selectedDisease.category] || selectedDisease.category, language)}
                  </Badge>
                  <Badge variant="outline">
                    <UserCheck className="size-3 mr-1" />
                    {selectedDisease.specialist}
                  </Badge>
                </div>

                {selectedDisease.symptoms && selectedDisease.symptoms.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm flex items-center gap-1.5 mb-2">
                      <Thermometer className="size-4 text-primary" /> {getDisplayName('Common Symptoms', URDU_UI['Common Symptoms'] || 'Common Symptoms', language)}
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedDisease.symptoms.map((s, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">{getDisplayName(s, URDU_SYMPTOMS[s] || s, language)}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedDisease.precautions && selectedDisease.precautions.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm flex items-center gap-1.5 mb-2">
                      <Shield className="size-4 text-primary" /> {getDisplayName('Precautions', URDU_UI['Precautions'] || 'Precautions', language)}
                    </h4>
                    <ul className="space-y-1">
                      {selectedDisease.precautions.map((p, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-1.5">
                          <CheckCircle2 className="size-3.5 text-emerald-500 mt-0.5 shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedDisease.medications && selectedDisease.medications.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm flex items-center gap-1.5 mb-2">
                      <Pill className="size-4 text-primary" /> {getDisplayName('Medications', URDU_UI['Medications'] || 'Medications', language)}
                    </h4>
                    <ul className="space-y-1">
                      {selectedDisease.medications.map((m, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-1.5">
                          <Syringe className="size-3.5 text-teal-500 mt-0.5 shrink-0" />
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedDisease.diet && selectedDisease.diet.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm flex items-center gap-1.5 mb-2">
                      <Apple className="size-4 text-primary" /> {getDisplayName('Diet Recommendations', URDU_UI['Diet Recommendations'] || 'Diet Recommendations', language)}
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedDisease.diet.map((d, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{d}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  className="bg-primary text-primary-foreground gap-2"
                  onClick={() => { setSelectedDisease(null); router.push('/checker') }}
                >
                  <Stethoscope className="size-4" />
                  Check Symptoms
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
