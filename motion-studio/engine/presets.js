/* =====================================================================
   CHARACTER PRESETS — the Vietadvisor cast.
   Each preset = a design spec for person(). Add new ones by copying.
   Cultural dress is drawn respectfully and simplified, never caricatured.
   ===================================================================== */
'use strict';
C.khaki = '#c9a66b';
function defChar(id, group, name, desc, spec) { CHAR[id] = { id, group, name, desc, spec: { seed: Object.keys(CHAR).length * 1.7, ...spec } }; }

// ------------------------------------------------ HOST
defChar('linh', 'host', 'Linh', 'Vietadvisor host & local guide from Hà Nội. Friendly, honest, knows the real prices. Signature brand-orange lanyard.', {
  skin: SKIN.s3, hair: { style: 'ponytail', color: HAIR.black, tie: C.brand }, lashes: 1,
  top: { type: 'tee', color: C.brand, print: 'star' }, bottom: { type: 'jeans', color: '#3d5a8a', cuff: 1 }, shoes: 'sneaker', shoeColor: '#f4efe6',
  acc: ['lanyard', 'bag'], bagColor: '#7a4a2a', eyeColor: '#2a1a12'
});
defChar('linh_aodai', 'host', 'Linh (áo dài)', 'Host in a white áo dài with gold lotus pattern — for culture, Tết and Huế episodes.', {
  skin: SKIN.s3, hair: { style: 'long', color: HAIR.black }, lashes: 1,
  top: { type: 'aodai', color: '#fbf6ee', pattern: 'lotus', color2: C.gold }, bottom: { type: 'aodaipants', color: '#fffdf7' }, shoes: 'heel', shoeColor: '#c9a66b', headwear: { type: 'nonla' }
});
// ------------------------------------------------ TOURISTS (one per market language)
defChar('dave', 'tourist', 'Dave 🇬🇧', 'British backpacker. Sunburnt, curious, slightly clueless — the audience stand-in. English market.', {
  skin: SKIN.s1, sunburn: 1, hair: { style: 'spiky', color: HAIR.brown }, freckles: 1,
  top: { type: 'tee', color: C.teal, print: 'star' }, bottom: { type: 'cargo_shorts', color: C.khaki }, shoes: 'sneaker',
  acc: ['backpack', 'bandana'], packColor: C.orange
});
defChar('jiwoo', 'tourist', 'Ji-woo 🇰🇷', 'Korean café-hopper and food photographer. Always has a camera. Korean market.', {
  skin: SKIN.s2, hair: { style: 'bob', color: HAIR.dark }, lashes: 1,
  top: { type: 'longsleeve', color: '#f4d9e4' }, bottom: { type: 'skirt', color: '#5c6f9e' }, shoes: 'sneaker', shoeColor: '#ffffff',
  acc: ['camera'], headwear: { type: 'beret', color: '#c9a66b' }
});
defChar('kenji', 'tourist', 'Kenji 🇯🇵', 'Japanese planner. Neat, punctual, has an itinerary spreadsheet. Japanese market.', {
  skin: SKIN.s2, hair: { style: 'side', color: HAIR.black }, glasses: 'square',
  top: { type: 'shirt', color: '#e9eef5', pocket: 1 }, bottom: { type: 'pants', color: '#4a5568' }, shoes: 'sneaker', shoeColor: '#2a2a2a',
  acc: ['bag'], bagColor: '#3a3a3a'
});
defChar('ploy', 'tourist', 'Ploy 🇹🇭', 'Thai street-food hunter. Loud laugh, tiny stomach, eats everything. Thai market.', {
  skin: SKIN.s4, hair: { style: 'long', color: HAIR.dark }, lashes: 1,
  top: { type: 'tee', color: C.yel, print: 'heart' }, bottom: { type: 'shorts', color: '#3d5a8a' }, shoes: 'sandal', shoeColor: '#e05a7a',
  headwear: { type: 'bucket', color: '#f2efe6' }
});
defChar('lena', 'tourist', 'Lena 🇩🇪', 'German hiker. Practical, tall, fearless on mountain passes. German market.', {
  skin: SKIN.s1, hair: { style: 'braid', color: HAIR.blonde, tie: '#3fa36b' }, lashes: 1, tall: 1.06, eyeColor: '#3b6aa0',
  top: { type: 'jacket', color: '#3f8f6b', inner: '#f2efe6' }, bottom: { type: 'pants', color: '#5b5048' }, shoes: 'boot', shoeColor: '#5a3b26',
  acc: ['bigpack'], packColor: '#c8553d'
});
defChar('sofia', 'tourist', 'Sofía 🇪🇸', 'Spanish traveller who loves nightlife and beaches. Expressive. Spanish market.', {
  skin: SKIN.s3, hair: { style: 'curly', color: HAIR.dark }, lashes: 1, lips: '#b23a48',
  top: { type: 'tank', color: '#e04a4a' }, bottom: { type: 'shorts', color: '#f2efe6' }, shoes: 'sandal', shoeColor: '#8a5a32',
  headwear: { type: 'flower', color: C.pink }, earring: C.gold
});
defChar('wei', 'tourist', 'Wei 🇨🇳', 'Chinese weekend traveller from Guangzhou. Tech-savvy, finds the best deals. Chinese market.', {
  skin: SKIN.s2, hair: { style: 'short', color: HAIR.black },
  top: { type: 'hoodie', color: '#4a6fa5' }, bottom: { type: 'pants', color: '#2f2f38' }, shoes: 'sneaker', shoeColor: '#f4efe6',
  headwear: { type: 'cap', color: '#2f2f38', back: 0 }, acc: ['bag'], bagColor: '#222'
});
// ------------------------------------------------ LOCALS — city
defChar('xeom', 'local', 'Bác Tư (xe ôm)', 'Veteran motorbike-taxi driver. Green army-style helmet, knows every alley.', {
  skin: SKIN.s5, age: 'elder', hair: { style: 'grey_short', color: HAIR.grey }, mustache: '#cfc8bd',
  top: { type: 'shirt', color: '#6f7d4f', long: 1 }, bottom: { type: 'pants', color: '#4f553c' }, shoes: 'sandal', shoeColor: '#4a3a2a',
  headwear: { type: 'helmet', color: '#5f6f3f' }
});
defChar('cophovn', 'local', 'Cô Hoa (phở vendor)', 'Runs a 30-year-old phở stall. Strict about broth, soft on regulars.', {
  skin: SKIN.s4, hair: { style: 'bun', color: HAIR.black }, build: 'stocky', wrinkles: 1,
  top: { type: 'baba', color: '#8ab4d8' }, bottom: { type: 'wide', color: '#2f2f38' }, shoes: 'flipflop', shoeColor: '#d03a3a',
  acc: ['apron']
});
defChar('banhmi', 'local', 'Anh Nam (bánh mì)', 'Young bánh mì cart owner in Sài Gòn. Fast hands, faster jokes.', {
  skin: SKIN.s4, hair: { style: 'short', color: HAIR.black },
  top: { type: 'tee', color: '#ffffff', print: 'text', text: 'BÁNH MÌ', color2: C.red }, bottom: { type: 'pants', color: '#3a3a44' }, shoes: 'flipflop',
  headwear: { type: 'cap', color: C.red, back: 1 }
});
defChar('cyclo', 'local', 'Chú Sáu (cyclo)', 'Cyclo driver in Hà Nội Old Quarter. Conical hat, endless patience.', {
  skin: SKIN.s5, age: 'elder', hair: { style: 'buzz', color: HAIR.grey },
  top: { type: 'shirt', color: '#d9c9a8', long: 1 }, bottom: { type: 'pants', color: '#6e5d48' }, shoes: 'sandal',
  headwear: { type: 'nonla' }
});
defChar('easyrider', 'local', 'Huy (Easy Rider)', 'Professional motorbike guide for the northern loops. Leather jacket, calm nerves.', {
  skin: SKIN.s4, hair: { style: 'short', color: HAIR.black }, goatee: HAIR.black,
  top: { type: 'leather', color: '#3a2a22', inner: '#d03a3a' }, bottom: { type: 'jeans', color: '#2f4a72' }, shoes: 'boot', shoeColor: '#2a1d16',
  headwear: { type: 'helmet', color: '#1f1f24', visor: 1 }
});
defChar('barista', 'local', 'Khoa (barista)', 'Sài Gòn specialty-coffee barista. Makes the best cà phê sữa đá in District 3.', {
  skin: SKIN.s3, hair: { style: 'topknot', color: HAIR.black }, beard: { color: HAIR.black, a: .5 },
  top: { type: 'tee', color: '#2f2f38' }, bottom: { type: 'jeans', color: '#3d5a8a' }, shoes: 'sneaker', acc: ['apron'], apronColor: '#8a5a32'
});
defChar('grandma', 'local', 'Bà Năm', 'Grandmother selling fruit at the market. Betel-stained smile, sharp bargainer.', {
  skin: SKIN.s5, age: 'elder', hair: { style: 'bun', color: HAIR.grey }, build: 'slim',
  top: { type: 'baba', color: '#7a4a7a' }, bottom: { type: 'wide', color: '#1f1f24' }, shoes: 'flipflop', headwear: { type: 'nonla', tilt: -.08 }
});
defChar('kid', 'local', 'Bé Bin', 'Local kid who waves at every tourist. Says "hello!" 400 times a day.', {
  skin: SKIN.s4, age: 'kid', hair: { style: 'short', color: HAIR.black },
  top: { type: 'tee', color: '#ffd35a', print: 'star' }, bottom: { type: 'shorts', color: '#3d7bd5' }, shoes: 'flipflop', shoeColor: '#3fa36b'
});
defChar('police', 'local', 'Officer Minh', 'Traffic officer — for "how it works" and safety episodes.', {
  skin: SKIN.s4, hair: { style: 'short', color: HAIR.black },
  top: { type: 'uniform', color: '#e8d48a' }, bottom: { type: 'pants', color: '#3f5a3f' }, shoes: 'boot', shoeColor: '#1f1f1f',
  headwear: { type: 'cap', color: '#3f5a3f' }
});
defChar('chef', 'local', 'Chef Tâm', 'Hội An cooking-class chef. White coat, dramatic tasting faces.', {
  skin: SKIN.s3, hair: { style: 'short', color: HAIR.black }, build: 'stocky', mustache: HAIR.black,
  top: { type: 'shirt', color: '#ffffff', long: 1 }, bottom: { type: 'pants', color: '#2f2f38' }, shoes: 'sneaker', shoeColor: '#2a2a2a', headwear: { type: 'chef' }
});
defChar('monk', 'local', 'Thầy Tâm (monk)', 'Buddhist monk in saffron robe — for pagoda & etiquette episodes. Shown calm and respectful.', {
  skin: SKIN.s4, hair: { style: 'bald', color: SKIN.s4 },
  top: { type: 'robe', color: '#e2902e' }, bottom: { type: 'longskirt', color: '#d07e22' }, shoes: 'sandal', face: { mouth: 'smile', mo: .4 }
});
defChar('fisher', 'local', 'Chú Ba (fisherman)', 'Hạ Long / Hội An fisherman, rows a basket boat (thuyền thúng).', {
  skin: SKIN.s6, hair: { style: 'buzz', color: HAIR.black }, build: 'slim',
  top: { type: 'tank', color: '#e9e4d8' }, bottom: { type: 'shorts', color: '#5b6f8a' }, shoes: 'barefoot', headwear: { type: 'nonla', tilt: .1 }
});
defChar('mekong', 'local', 'Chị Út (Mekong boat)', 'Floating-market seller in Cần Thơ. Áo bà ba, khăn rằn, rows standing up.', {
  skin: SKIN.s5, hair: { style: 'bun', color: HAIR.black }, lashes: 1,
  top: { type: 'baba', color: '#f2efe6' }, bottom: { type: 'wide', color: '#1f1f24' }, shoes: 'barefoot', acc: ['khanran'], headwear: { type: 'nonla' }
});
defChar('lantern', 'local', 'Cô Mai (lantern seller)', 'Hội An silk-lantern maker in a blue áo dài.', {
  skin: SKIN.s3, hair: { style: 'long', color: HAIR.black }, lashes: 1,
  top: { type: 'aodai', color: '#3f7fd0', pattern: 'flower', color2: '#ffe08a' }, bottom: { type: 'aodaipants', color: '#ffffff' }, shoes: 'heel', shoeColor: '#c9a66b'
});
// ------------------------------------------------ ETHNIC MINORITIES (northern highlands)
defChar('hmong_grandpa', 'ethnic', 'Ông Sùng (H\'Mông)', 'Hà Giang homestay host. Black headwrap, indigo jacket with embroidered trim. Pours corn wine.', {
  skin: SKIN.s5, age: 'elder', hair: { style: 'short', color: HAIR.black }, mustache: '#3a3330', wrinkles: 1,
  top: { type: 'hmong', color: '#2b2f52', bands: [C.red, C.gold, '#3fa36b'], cuffs: [C.red, C.gold] }, bottom: { type: 'pants', color: '#22223a' }, shoes: 'sandal', shoeColor: '#2a2a2a',
  headwear: { type: 'hmongwrap', color: '#24233a' }, face: { eye: 'happy', mouth: 'smile', mo: .8 }
});
defChar('hmong_woman', 'ethnic', 'Chị Mỷ (Black H\'Mông)', 'Sa Pa trekking guide. Indigo-dyed clothes, silver neck rings, leg wraps.', {
  skin: SKIN.s4, hair: { style: 'bun', color: HAIR.black }, lashes: 1,
  top: { type: 'hmong', color: '#2c3358', bands: ['#3a7bd5', C.red, C.gold], cuffs: ['#3a7bd5', C.red], apron: '#1f2340' }, bottom: { type: 'pleated', color: '#252a4a', bands: ['#3a7bd5'], batik: '#7f9ad8' }, shoes: 'sandal', shoeColor: '#222',
  headwear: { type: 'hmongwrap', color: '#2a2f55' }, acc: ['silverring', 'gui'], guiFill: '#7cb85c', earring: '#e8eaee'
});
defChar('flower_hmong', 'ethnic', 'Chị Pàng (Flower H\'Mông)', 'Bắc Hà Sunday-market seller. The most colourful outfit in Vietnam.', {
  skin: SKIN.s4, hair: { style: 'bun', color: HAIR.black }, lashes: 1,
  top: { type: 'flowerhmong', color: '#e04a8a', cuffs: [C.gold, '#3fa36b', '#3a7bd5'], sleeve: '#2c3358' }, bottom: { type: 'pleated', color: '#e04a8a', bands: [C.gold, '#3fa36b', '#3a7bd5'] }, shoes: 'sandal',
  headwear: { type: 'flowerhmong', color: '#e04a8a' }, acc: ['silverring'], earring: '#e8eaee'
});
defChar('red_dao', 'ethnic', 'Chị Mẩy (Red Dao)', 'Tả Phìn herbal-bath keeper. Big red turban with tassels, red pompom jacket.', {
  skin: SKIN.s4, hair: { style: 'bald', color: SKIN.s4 }, lashes: 1,
  top: { type: 'dao', color: '#262a44', cuffs: [C.red, C.gold] }, bottom: { type: 'pants', color: '#262a44' }, shoes: 'sandal',
  headwear: { type: 'daoturban', color: '#d4261f' }, earring: '#e8eaee'
});
defChar('thai_woman', 'ethnic', 'Chị Lò (White Thái)', 'Mai Châu stilt-house host. Fitted blouse with silver butterfly buttons, khăn piêu scarf.', {
  skin: SKIN.s3, hair: { style: 'bun', color: HAIR.black }, lashes: 1, build: 'slim',
  top: { type: 'thai', color: '#f3f1ec' }, bottom: { type: 'longskirt', color: '#1f1d24' }, shoes: 'sandal',
  headwear: { type: 'thai', color: '#1f1d24' }
});
defChar('ede', 'ethnic', 'Anh Y Ksơr (Ê Đê)', 'Central Highlands coffee farmer. Indigo top with red-white woven borders.', {
  skin: SKIN.s6, hair: { style: 'short', color: HAIR.black },
  top: { type: 'vest', color: '#1f2340', inner: '#c23a2a' }, bottom: { type: 'sarong', color: '#1f2340', band: '#c23a2a' }, shoes: 'barefoot', bracelet: '#e8eaee'
});
defChar('cham', 'ethnic', 'Chị Thị (Chăm)', 'Ninh Thuận pottery maker. Long tunic and white headscarf.', {
  skin: SKIN.s5, hair: { style: 'long', color: HAIR.black }, lashes: 1,
  top: { type: 'aodai', color: '#c94a3a', pattern: 'flower', color2: '#f8e3a0' }, bottom: { type: 'longskirt', color: '#5a2a24' }, shoes: 'sandal', headwear: { type: 'headband', color: '#f3f1ec' }
});
// apron accessory (vendors, barista)
const _frontAcc = frontAcc;
frontAcc = function (spec, b, shY, hipY, t, o) {
  _frontAcc(spec, b, shY, hipY, t, o);
  if ((spec.acc || []).includes('apron')) { const tw = b.tw / 2; sRR(-tw * .7, shY + 30, tw * 1.4, hipY - shY + 10, 10, spec.apronColor || '#f2efe6', { lw: 5 }); line(-tw * .7, shY + 30, -tw + 2, shY + 4, 4); line(tw * .7, shY + 30, tw - 2, shY + 4, 4); }
};
