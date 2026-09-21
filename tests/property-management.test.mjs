import test from 'node:test';
import assert from 'node:assert/strict';
import { propertyInputSchema, resolvePropertyTranslations } from '../lib/property-validation.ts';
import { uploadError, MAX_UPLOAD_BYTES } from '../lib/upload-validation.ts';
import { enquirySchema, leadMessage } from '../lib/enquiry-validation.ts';

const draft = {
  slug: 'villa-prueba', name: 'Villa prueba', reference: null, type: 'villa', status: 'en_venta',
  published: false, featured: false, sort_order: 0, zone: null, province: 'Alicante', price: 300000.50,
  price_from: true, bedrooms: 3, bathrooms: 2, area_m2: 102.25, plot_m2: null, energy_rating: null,
  maps_url: null, virtual_tour_url: null, video_url: null, cover_image: null, floor_plan: null,
  gallery: [], pois: [], amenities: [], description_es: 'Descripción', features_es: ['Piscina'],
};
const enquiry = {kind: 'contacto', name: 'Test persona', email: 'test@example.com', message: 'Consulta', locale: 'es', consent: true};

test('a manual draft accepts decimal price and area without an uploaded cover', () => {
  assert.equal(propertyInputSchema.safeParse(draft).success, true);
});
test('publication requires cover and description; bedrooms reject fractions', () => {
  for (const input of [{...draft, published: true}, {...draft, published: true, cover_image: 'https://example.com/photo.jpg', description_es: ''}, {...draft, bedrooms: 1.5}])
    assert.equal(propertyInputSchema.safeParse(input).success, false);
});
test('edits must carry the version originally loaded to detect concurrent changes', () => {
  const input = {...draft, id: 'dd1cb660-c320-4a4b-b164-e3755f1c3b63'};
  assert.equal(propertyInputSchema.safeParse(input).success, false);
  assert.equal(propertyInputSchema.safeParse({...input, expected_updated_at: '2026-09-21T09:00:00Z'}).success, true);
});
test('changing price or photographs preserves existing languages without calling AI', async () => {
  const previous = Object.fromEntries(['es','en','de','nl','fr'].map(locale => [locale, {description: locale === 'es' ? 'Descripción' : `Translation ${locale}`, features: ['Piscina']}]));
  let calls = 0;
  const result = await resolvePropertyTranslations(previous.es, previous, async () => { calls++; throw new Error('not configured'); });
  assert.equal(calls, 0);
  assert.deepEqual(result.translations, previous);
});
test('failed translation is explicit and does not pretend Spanish is another language', async () => {
  const result = await resolvePropertyTranslations({description: 'Nueva descripción', features: []}, undefined, async () => {throw new Error('offline');});
  assert.ok(result.warning);
  assert.deepEqual(Object.keys(result.translations), ['es']);
});
test('all languages can be supplied manually without an AI dependency', () => {
  const manual_translations = Object.fromEntries(['en','de','nl','fr'].map(code => [code, {description: `Description ${code}`, features: []}]));
  assert.equal(propertyInputSchema.safeParse({...draft, manual_translations}).success, true);
  assert.equal(propertyInputSchema.safeParse({...draft, manual_translations: {en: manual_translations.en}}).success, false);
});
test('uploads reject PDFs, HEIC, empty files and oversized images with visible reasons', () => {
  for (const f of [{name:'plan.pdf',type:'application/pdf',size:100}, {name:'phone.heic',type:'image/heic',size:100}, {name:'empty.jpg',type:'image/jpeg',size:0}, {name:'big.jpg',type:'image/jpeg',size:MAX_UPLOAD_BYTES+1}]) assert.ok(uploadError(f));
  assert.equal(uploadError({name:'photo.webp',type:'image/webp',size:1024}), null);
});
test('all enquiry entry points require explicit consent', () => {
  assert.equal(enquirySchema.safeParse(enquiry).success, true);
  assert.equal(enquirySchema.safeParse({...enquiry, consent:false}).success, false);
  assert.equal(enquirySchema.safeParse({...enquiry, consent:undefined}).success, false);
});
test('lead messages respect the database limit including agency fields', () => {
  assert.equal(enquirySchema.safeParse({...enquiry, message:'x'.repeat(2000)}).success, true);
  assert.equal(enquirySchema.safeParse({...enquiry, message:'x'.repeat(2001)}).success, false);
  const partner = {...enquiry, kind:'colabora', agency:'a'.repeat(160), country:'c'.repeat(80), website:'w'.repeat(200), message:'x'.repeat(1500)};
  assert.ok(leadMessage(partner).length <= 2000);
  assert.equal(enquirySchema.safeParse(partner).success, true);
  assert.equal(enquirySchema.safeParse({...partner,message:'x'.repeat(2000)}).success, false);
});
test('visits reject impossible calendar dates; the date is optional', () => {
  assert.equal(enquirySchema.safeParse({...enquiry,kind:'visita',preferredDate:'2026-02-30'}).success, false);
  assert.equal(enquirySchema.safeParse({...enquiry,kind:'visita',preferredDate:''}).success, true);
});
