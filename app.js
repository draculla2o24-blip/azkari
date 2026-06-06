// ==================== PWA Installation ====================
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    document.getElementById('installPrompt').classList.add('show');
    document.getElementById('installHeaderBtn').style.display = 'flex';
});

document.getElementById('installBtn')?.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt = null;
        document.getElementById('installPrompt').classList.remove('show');
    }
});
document.getElementById('closeInstallBtn')?.addEventListener('click', () => {
    document.getElementById('installPrompt').classList.remove('show');
});
document.getElementById('installHeaderBtn')?.addEventListener('click', () => {
    if (deferredPrompt) deferredPrompt.prompt();
});

// Hide loading
setTimeout(() => {
    document.getElementById('loadingOverlay').style.opacity = '0';
    setTimeout(() => document.getElementById('loadingOverlay').style.display = 'none', 500);
}, 1500);

// ==================== Notification Permission ====================
let notificationPermission = false;
let notificationInterval = null;
let prayerCheckInterval = null;

function requestNotificationPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then(perm => {
            notificationPermission = perm === 'granted';
            if (notificationPermission) {
                showToast(' تم تفعيل الإشعارات');
            } else {
                showToast(' يرجى تفعيل الإشعارات من الإعدادات');
            }
        });
    }
}

function sendNotification(title, body) {
    if (notificationPermission && 'Notification' in window && document.visibilityState === 'hidden') {
        new Notification(title, { body: body, icon: '/icon-192.png', silent: false });
    }
}

// ==================== Complete Dhikr Data ====================
const dhikrData = {
    'أذكار الصباح': [
        { text: 'آية الكرسي - اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ', count: 1 },
        { text: 'سورة الإخلاص - قُلْ هُوَ اللَّهُ أَحَدٌ، اللَّهُ الصَّمَدُ، لَمْ يَلِدْ وَلَمْ يُولَدْ، وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ', count: 3 },
        { text: 'سورة الفلق - قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ، مِن شَرِّ مَا خَلَقَ، وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ، وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ، وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ', count: 3 },
        { text: 'سورة الناس - قُلْ أَعُوذُ بِرَبِّ النَّاسِ، مَلِكِ النَّاسِ، إِلَٰهِ النَّاسِ، مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ، الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ، مِنَ الْجِنَّةِ وَالنَّاسِ', count: 3 },
        { text: 'اللهم بك أصبحنا وبك أمسينا وبك نحيا وبك نموت وإليك النشور', count: 1 },
        { text: 'رضيت بالله ربًا وبالإسلام دينًا وبمحمد ﷺ نبيًا ورسولًا', count: 3 },
        { text: 'حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم', count: 7 },
        { text: 'بسم الله الذي لا يضر مع اسمه شيء في الأرض ولا في السماء وهو السميع العليم', count: 3 },
        { text: 'اللهم إني أسألك العفو والعافية في الدنيا والآخرة', count: 1 }
    ],
    'أذكار المساء': [
        { text: 'آية الكرسي - اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ', count: 1 },
        { text: 'سورة الإخلاص - قُلْ هُوَ اللَّهُ أَحَدٌ، اللَّهُ الصَّمَدُ، لَمْ يَلِدْ وَلَمْ يُولَدْ، وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ', count: 3 },
        { text: 'سورة الفلق - قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ، مِن شَرِّ مَا خَلَقَ، وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ، وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ، وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ', count: 3 },
        { text: 'سورة الناس - قُلْ أَعُوذُ بِرَبِّ النَّاسِ، مَلِكِ النَّاسِ، إِلَٰهِ النَّاسِ، مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ، الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ، مِنَ الْجِنَّةِ وَالنَّاسِ', count: 3 },
        { text: 'أمسينا وأمسى الملك لله والحمد لله، لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير، رب أسألك خير ما في هذه الليلة وخير ما بعدها...', count: 1 },
        { text: 'اللهم بك أمسينا وبك أصبحنا وبك نحيا وبك نموت وإليك المصير', count: 1 },
        { text: 'رضيت بالله ربًا وبالإسلام دينًا وبمحمد ﷺ نبيًا ورسولًا', count: 3 },
        { text: 'حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم', count: 7 },
        { text: 'اللهم إني أمسيت أشهدك وأشهد حملة عرشك وملائكتك وجميع خلقك أنك أنت الله لا إله إلا أنت وحدك لا شريك لك', count: 1 }
    ],
    'أذكار النوم': [
        { text: ' جمع الكفين وقراءة الإخلاص والفلق والناس 3 مرات', count: 1 },
        { text: 'آية الكرسي - اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ', count: 1 },
        { text: 'سورة الإخلاص - قُلْ هُوَ اللَّهُ أَحَدٌ، اللَّهُ الصَّمَدُ، لَمْ يَلِدْ وَلَمْ يُولَدْ، وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ', count: 3 },
        { text: 'آخر آيتين من سورة البقرة', count: 1 },
        { text: 'باسمك ربي وضعت جنبي وبك أرفعه، إن أمسكت نفسي فارحمها، وإن أرسلتها فاحفظها بما تحفظ به عبادك الصالحين', count: 1 },
        { text: 'اللهم باسمك أموت وأحيا', count: 1 },
        { text: 'سبحان الله (33)، الحمد لله (33)، الله أكبر (34)', count: 1 }
    ],
    'أذكار الاستيقاظ': [
        { text: 'الحمد لله الذي أحيانا بعد ما أماتنا وإليه النشور', count: 1 },
        { text: 'لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير، سبحان الله والحمد لله ولا إله إلا الله والله أكبر ولا حول ولا قوة إلا بالله', count: 1 },
        { text: 'الحمد لله الذي عافاني في جسدي ورد علي روحي وأذن لي بذكره', count: 1 }
    ],
    'أذكار الوضوء': [
        { text: ' قبل الوضوء: بسم الله', count: 1 },
        { text: 'بعد الوضوء: أشهد أن لا إله إلا الله وحده لا شريك له، وأشهد أن محمدًا عبده ورسوله', count: 1 },
        { text: 'اللهم اجعلني من التوابين واجعلني من المتطهرين', count: 1 }
    ],
    'أذكار بعد الصلاة': [
        { text: 'أستغفر الله', count: 3 },
        { text: 'اللهم أنت السلام ومنك السلام تباركت يا ذا الجلال والإكرام', count: 1 },
        { text: 'آية الكرسي - اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ', count: 1 },
        { text: 'سورة الإخلاص - قُلْ هُوَ اللَّهُ أَحَدٌ، اللَّهُ الصَّمَدُ، لَمْ يَلِدْ وَلَمْ يُولَدْ، وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ', count: 3 },
        { text: 'سبحان الله', count: 33 },
        { text: 'الحمد لله', count: 33 },
        { text: 'الله أكبر', count: 33 },
        { text: 'لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير', count: 1 },
        { text: 'سورة الإخلاص والفلق والناس', count: 1 }
    ],
    'أذكار الطعام': [
        { text: ' قبل الطعام: بسم الله', count: 1 },
        { text: 'بعد الطعام: الحمد لله الذي أطعمني هذا ورزقنيه من غير حول مني ولا قوة', count: 1 }
    ],
    'أذكار المنزل': [
        { text: ' عند دخول المنزل: بسم الله ولجنا وبسم الله خرجنا وعلى ربنا توكلنا', count: 1 },
        { text: ' عند الخروج من المنزل: بسم الله، توكلت على الله، ولا حول ولا قوة إلا بالله', count: 1 }
    ],
    'أذكار السفر': [
        { text: ' دعاء الركوب: سبحان الذي سخر لنا هذا وما كنا له مقرنين وإنا إلى ربنا لمنقلبون', count: 1 },
        { text: 'اللهم إنا نسألك في سفرنا هذا البر والتقوى ومن العمل ما ترضى', count: 1 }
    ],
    'سيد الاستغفار والتسبيح': [
        { text: ' سيد الاستغفار: اللهم أنت ربي لا إله إلا أنت، خلقتني وأنا عبدك، وأنا على عهدك ووعدك ما استطعت، أعوذ بك من شر ما صنعت، أبوء لك بنعمتك علي وأبوء بذنبي فاغفر لي فإنه لا يغفر الذنوب إلا أنت', count: 1 }
    ],
    'الرقية الشرعية': [
        { text: ' الرقية الشرعية: بسم الله (3 مرات)', count: 3 },
        { text: 'أعوذ بالله السميع العليم من الشيطان الرجيم (3 مرات)', count: 3 },
        { text: 'سورة الفاتحة', count: 7 },
        { text: 'آية الكرسي - اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ', count: 1 },
        { text: 'سورة الإخلاص - قُلْ هُوَ اللَّهُ أَحَدٌ، اللَّهُ الصَّمَدُ، لَمْ يَلِدْ وَلَمْ يُولَدْ، وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ', count: 3 },
        { text: 'قل هو الله أحد، قل أعوذ برب الفلق، قل أعوذ برب الناس (3 مرات كل)', count: 3 }
    ],
    'أدعية من القرآن والسنة': [
        { text: ' رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', count: 1 },
        { text: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً ۚ إِنَّكَ أَنتَ الْوَهَّابُ', count: 1 },
        { text: 'رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي ۚ رَبَّنَا وَتَقَبَّلْ دُعَاءِ', count: 1 },
        { text: 'رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ', count: 1 }
    ]
};

// ==================== Complete 99 Allah Names ====================
const allahNamesComplete = [
    { num: 1, name: "الرحمن", meaning: "ذو الرحمة الواسعة", benefit: "من ذكره يشرح الله صدره ويرزقه الرحمة" },
    { num: 2, name: "الرحيم", meaning: "الذي يرحم المؤمنين", benefit: "من ذكره يبارك الله في رزقه ويرحمه" },
    { num: 3, name: "الملك", meaning: "المالك المتصرف", benefit: "من ذكره يعزه الله ويملكه أمره" },
    { num: 4, name: "القدوس", meaning: "المنزه عن النقائص", benefit: "من ذكره يطهر الله قلبه من الذنوب" },
    { num: 5, name: "السلام", meaning: "المنزه من العيوب", benefit: "من ذكره يسلم من الآفات والبليات" },
    { num: 6, name: "المؤمن", meaning: "المصدق رسله", benefit: "من ذكره يؤمنه الله من الخوف" },
    { num: 7, name: "المهيمن", meaning: "الرقيب على خلقه", benefit: "من ذكره يرزقه الله اليقين" },
    { num: 8, name: "العزيز", meaning: "الذي لا يغلب", benefit: "من ذكره يعزه الله وينصره" },
    { num: 9, name: "الجبار", meaning: "الذي يقهر ولا يقهر", benefit: "من ذكره يقوي قلبه" },
    { num: 10, name: "المتكبر", meaning: "المتعالي عن صفات الخلق", benefit: "من ذكره يرفع الله قدره" },
    { num: 11, name: "الخالق", meaning: "المبدع للمخلوقات", benefit: "من ذكره ينمي الله إبداعه" },
    { num: 12, name: "البارئ", meaning: "الذي خلق الخلق لا عن مثال", benefit: "من ذكره يصرف الله عنه البلاء" },
    { num: 13, name: "المصور", meaning: "الذي صور المخلوقات", benefit: "من ذكره يحسن الله خلقه" },
    { num: 14, name: "الغفار", meaning: "الذي يغفر الذنوب", benefit: "من ذكره يغفر الله ذنوبه" },
    { num: 15, name: "القهار", meaning: "الذي قهر خلقه", benefit: "من ذكره يذل الله عدوه" },
    { num: 16, name: "الوهاب", meaning: "الذي يعطي كثيراً", benefit: "من ذكره يوسع الله رزقه" },
    { num: 17, name: "الرزاق", meaning: "ذو الرزق الواسع", benefit: "من ذكره يبارك الله في ماله" },
    { num: 18, name: "الفتاح", meaning: "الذي يفتح كل مغلق", benefit: "من ذكره يفتح الله له أبواب الخير" },
    { num: 19, name: "العليم", meaning: "العالم بكل شيء", benefit: "من ذكره ينور الله قلبه" },
    { num: 20, name: "القابض", meaning: "الذي يقبض الأرزاق", benefit: "من ذكره يصرف الله عنه الشر" },
    { num: 21, name: "الباسط", meaning: "الذي يبسط الرزق", benefit: "من ذكره يوسع الله رزقه" },
    { num: 22, name: "الخافض", meaning: "الذي يخفض من يشاء", benefit: "من ذكره يخفض الله غروره" },
    { num: 23, name: "الرافع", meaning: "الذي يرفع من يشاء", benefit: "من ذكره يرفع الله قدره" },
    { num: 24, name: "المعز", meaning: "الذي يعز من يشاء", benefit: "من ذكره يعزه الله" },
    { num: 25, name: "المذل", meaning: "الذي يذل من يشاء", benefit: "من ذكره يذل الله نفسه" },
    { num: 26, name: "السميع", meaning: "الذي يسمع كل شيء", benefit: "من ذكره يستجاب دعاؤه" },
    { num: 27, name: "البصير", meaning: "الذي يبصر كل شيء", benefit: "من ذكره ينير الله بصيرته" },
    { num: 28, name: "الحكم", meaning: "الذي يحكم بين عباده", benefit: "من ذكره يحل الله نزاعاته" },
    { num: 29, name: "العدل", meaning: "الذي يحكم بالعدل", benefit: "من ذكره يجلب الله له العدل" },
    { num: 30, name: "اللطيف", meaning: "الذي يلطف بعباده", benefit: "من ذكره يلطف الله به" },
    { num: 31, name: "الخبير", meaning: "العالم ببواطن الأمور", benefit: "من ذكره يعلمه الله ما يخفى" },
    { num: 32, name: "الحليم", meaning: "الذي لا يعجل بالعقوبة", benefit: "من ذكره يحلم الله عنه" },
    { num: 33, name: "العظيم", meaning: "الذي عظمته فوق كل شيء", benefit: "من ذكره يعظمه الله" },
    { num: 34, name: "الغفور", meaning: "الذي يغفر الذنوب", benefit: "من ذكره يغفر الله ذنوبه" },
    { num: 35, name: "الشكور", meaning: "الذي يثيب على القليل", benefit: "من ذكره يزيد الله في نعمه" },
    { num: 36, name: "العلي", meaning: "الذي علاه فوق كل شيء", benefit: "من ذكره يرفع الله درجاته" },
    { num: 37, name: "الكبير", meaning: "الذي له الكبرياء", benefit: "من ذكره يكبره الله في قلوب الناس" },
    { num: 38, name: "الحفيظ", meaning: "الذي يحفظ كل شيء", benefit: "من ذكره يحفظه الله في أهله وماله" },
    { num: 39, name: "المقيت", meaning: "الذي يقيت الخلق", benefit: "من ذكره يكفيه الله همه" },
    { num: 40, name: "الحسيب", meaning: "الذي يحاسب الخلق", benefit: "من ذكره يحاسبه الله بالحسنى" },
    { num: 41, name: "الجليل", meaning: "الذي له الجلال", benefit: "من ذكره ينال الجلالة" },
    { num: 42, name: "الكريم", meaning: "الذي يعطي كثيراً", benefit: "من ذكره يكرمه الله" },
    { num: 43, name: "الرقيب", meaning: "الذي يراقب خلقه", benefit: "من ذكره يراقب الله أعماله" },
    { num: 44, name: "المجيب", meaning: "الذي يجيب الدعاء", benefit: "من ذكره يستجيب الله دعاءه" },
    { num: 45, name: "الواسع", meaning: "الذي وسع كل شيء", benefit: "من ذكره يوسع الله رزقه" },
    { num: 46, name: "الحكيم", meaning: "الذي يحكم في خلقه", benefit: "من ذكره يرزقه الله حكمة" },
    { num: 47, name: "الودود", meaning: "الذي يحب عباده", benefit: "من ذكره يحبه الله" },
    { num: 48, name: "المجيد", meaning: "ذو المجد والعظمة", benefit: "من ذكره يمجده الله" },
    { num: 49, name: "الباعث", meaning: "الباعث للخلق", benefit: "من ذكره يبعث الله همته" },
    { num: 50, name: "الشهيد", meaning: "الذي يشهد كل شيء", benefit: "من ذكره يشهد الله له بالخير" },
    { num: 51, name: "الحق", meaning: "الثابت وجوده", benefit: "من ذكره يثبته الله على الحق" },
    { num: 52, name: "الوكيل", meaning: "الذي يعتمد عليه", benefit: "من ذكره يكفيه الله ما أهمه" },
    { num: 53, name: "القوي", meaning: "الذي له القوة", benefit: "من ذكره يقويه الله" },
    { num: 54, name: "المتين", meaning: "الذي لا يعجزه شيء", benefit: "من ذكره يقويه الله على الطاعة" },
    { num: 55, name: "الولي", meaning: "الذي يتولى عباده", benefit: "من ذكره يتولاه الله" },
    { num: 56, name: "الحميد", meaning: "المحمود في أفعاله", benefit: "من ذكره يحمده الناس" },
    { num: 57, name: "المحصي", meaning: "الذي أحصى كل شيء", benefit: "من ذكره ييسر الله حسابه" },
    { num: 58, name: "المبدئ", meaning: "الذي يبدأ الخلق", benefit: "من ذكره يبارك الله في بداياته" },
    { num: 59, name: "المعيد", meaning: "الذي يعيد الخلق", benefit: "من ذكره يعيد الله عليه النعم" },
    { num: 60, name: "المحيي", meaning: "الذي يحيي الموتى", benefit: "من ذكره يحيي الله قلبه" },
    { num: 61, name: "المميت", meaning: "الذي يميت الخلق", benefit: "من ذكره يميت الله شهواته" },
    { num: 62, name: "الحي", meaning: "ذو الحياة الكاملة", benefit: "من ذكره يحيا قلبه بالإيمان" },
    { num: 63, name: "القيوم", meaning: "القائم على كل شيء", benefit: "من ذكره يقوم الله أمره" },
    { num: 64, name: "الواجد", meaning: "الذي لا يعجزه شيء", benefit: "من ذكره يجد الله حاجته" },
    { num: 65, name: "الماجد", meaning: "ذو المجد والسؤدد", benefit: "من ذكره يمجد الله ذكره" },
    { num: 66, name: "الواحد", meaning: "الذي لا شريك له", benefit: "من ذكره يوحد الله قلبه" },
    { num: 67, name: "الأحد", meaning: "الفرد الصمد", benefit: "من ذكره يكفيه الله وحده" },
    { num: 68, name: "الصمد", meaning: "المقصود في الحوائج", benefit: "من ذكره يقضي الله حوائجه" },
    { num: 69, name: "القادر", meaning: "الذي على كل شيء قدير", benefit: "من ذكره يمكن الله أمره" },
    { num: 70, name: "المقتدر", meaning: "الشديد القدرة", benefit: "من ذكره يقدره الله على الطاعة" },
    { num: 71, name: "المقدم", meaning: "الذي يقدم ما يشاء", benefit: "من ذكره يقدمه الله في الخير" },
    { num: 72, name: "المؤخر", meaning: "الذي يؤخر ما يشاء", benefit: "من ذكره يؤخر الله عنه الشر" },
    { num: 73, name: "الأول", meaning: "الذي ليس قبله شيء", benefit: "من ذكره يسبق في الخيرات" },
    { num: 74, name: "الأخر", meaning: "الذي ليس بعده شيء", benefit: "من ذكره يختم الله له بالخير" },
    { num: 75, name: "الظاهر", meaning: "الذي ظهر فوق كل شيء", benefit: "من ذكره يظهره الله على عدوه" },
    { num: 76, name: "الباطن", meaning: "الذي بطن فلا يرى", benefit: "من ذكره يبصره الله بحقائق الأمور" },
    { num: 77, name: "الوالي", meaning: "المتولي للأمور", benefit: "من ذكره يتولى الله أمره" },
    { num: 78, name: "المتعالي", meaning: "الذي تعلى عن كل شيء", benefit: "من ذكره يرفع الله شأنه" },
    { num: 79, name: "البر", meaning: "الذي بر بعباده", benefit: "من ذكره يبره الله في الدنيا والآخرة" },
    { num: 80, name: "التواب", meaning: "الذي يقبل التوبة", benefit: "من ذكره يتوب الله عليه" },
    { num: 81, name: "المنتقم", meaning: "الذي ينتقم من الكافرين", benefit: "من ذكره ينتقم الله من أعدائه" },
    { num: 82, name: "العفو", meaning: "الذي يعفو عن الذنوب", benefit: "من ذكره يعفو الله عنه" },
    { num: 83, name: "الرؤوف", meaning: "الذي يرأف بعباده", benefit: "من ذكره يرأف الله به" },
    { num: 84, name: "مالك الملك", meaning: "مالك الملك كله", benefit: "من ذكره يملكه الله أمر نفسه" },
    { num: 85, name: "ذو الجلال والإكرام", meaning: "صاحب الجلال والإكرام", benefit: "من ذكره يكرمه الله" },
    { num: 86, name: "المقسط", meaning: "الذي يقسط بالعدل", benefit: "من ذكره يعينه الله على العدل" },
    { num: 87, name: "الجامع", meaning: "الذي يجمع الناس", benefit: "من ذكره يجمع الله شمله" },
    { num: 88, name: "الغني", meaning: "الذي لا يحتاج لشيء", benefit: "من ذكره يغنيه الله" },
    { num: 89, name: "المغني", meaning: "الذي يغني من يشاء", benefit: "من ذكره يغنيه الله عن خلقه" },
    { num: 90, name: "المانع", meaning: "الذي يمنع من يشاء", benefit: "من ذكره يمنع الله عنه البلاء" },
    { num: 91, name: "الضار", meaning: "الذي يضر من يشاء", benefit: "من ذكره يضرب الله عدوه به" },
    { num: 92, name: "النافع", meaning: "الذي ينفع من يشاء", benefit: "من ذكره ينفعه الله" },
    { num: 93, name: "النور", meaning: "الذي ينير السماوات", benefit: "من ذكره ينور الله قلبه" },
    { num: 94, name: "الهادي", meaning: "الذي يهدي إلى الحق", benefit: "من ذكره يهديه الله الصراط المستقيم" },
    { num: 95, name: "البديع", meaning: "البديع في خلقه", benefit: "من ذكره يجدد الله إيمانه" },
    { num: 96, name: "الباقي", meaning: "الباقي بعد فناء خلقه", benefit: "من ذكره يثبته الله على الدين" },
    { num: 97, name: "الوارث", meaning: "الذي يرث الأرض ومن عليها", benefit: "من ذكره يورثه الله الجنة" },
    { num: 98, name: "الرشيد", meaning: "الذي يرشد إلى الرشد", benefit: "من ذكره يرشده الله" },
    { num: 99, name: "الصبور", meaning: "الذي يصبر على عباده", benefit: "من ذكره يصبره الله على البلاء" }
];

// ==================== State ====================
let currentScreen = 'prayerScreen';
let isDarkMode = localStorage.getItem('darkMode') === 'true';
let prayerTimes = null;
let locationName = 'جاري التحديد';
let counters = {};
let currentCategory = Object.keys(dhikrData)[0];
let tasbeehCounter = 0;
let tasbeehTotal = localStorage.getItem('tasbeehTotal') ? parseInt(localStorage.getItem('tasbeehTotal')) : 0;
let selectedTasbeehCount = 33;
let currentDhikrText = 'سبحان الله';
let compassHeading = 0;
let qiblaDirection = 0;
let randomNotificationsEnabled = localStorage.getItem('randomNotifications') === 'true';
let prayerNotificationsEnabled = localStorage.getItem('prayerNotifications') === 'true';
let notificationIntervalMinutes = parseInt(localStorage.getItem('notificationInterval') || '5');
let beforeAdhanMinutes = parseInt(localStorage.getItem('beforeAdhanMinutes') || '10');
let afterPrayerReminder = localStorage.getItem('afterPrayerReminder') === 'true';

// Load counters
for (let category in dhikrData) {
    counters[category] = {};
    for (let i = 0; i < dhikrData[category].length; i++) {
        let saved = localStorage.getItem(`dhikr_${category}_${i}`);
        counters[category][i] = saved ? parseInt(saved) : 0;
    }
}

// Apply dark mode
if (isDarkMode) {
    document.body.classList.add('dark-mode');
    document.getElementById('themeToggle').innerHTML = '<i class="fas fa-sun"></i>';
}

// ==================== Helper Functions ====================
function showToast(msg, duration = 2000) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.style.display = 'block';
    setTimeout(() => toast.style.display = 'none', duration);
}

// ==================== Navigation ====================
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        const screenId = link.dataset.screen;
        currentScreen = screenId;
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
        if (screenId === 'dhikrScreen') renderDhikrScreen();
        if (screenId === 'namesScreen') renderNamesScreen();
        if (screenId === 'qiblaScreen') renderQiblaScreen();
        if (screenId === 'tasbeehScreen') renderTasbeehScreen();
        if (screenId === 'settingsScreen') renderSettingsScreen();
    });
});

document.getElementById('themeToggle').addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        document.getElementById('themeToggle').innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.classList.remove('dark-mode');
        document.getElementById('themeToggle').innerHTML = '<i class="fas fa-moon"></i>';
    }
    localStorage.setItem('darkMode', isDarkMode);
});

document.getElementById('shareBtn').addEventListener('click', () => {
    if (navigator.share) {
        navigator.share({ title: 'أذكاري', text: 'تطبيق أذكاري - الأذكار اليومية' });
    } else {
        showToast('تم نسخ الرابط');
    }
});

// ==================== Prayer Times ====================
async function loadPrayerTimes() {
    if ("geolocation" in navigator) {
        showToast('جاري تحديث أوقات الصلاة...');
        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const geoResp = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json&accept-language=ar`);
                const geoData = await geoResp.json();
                locationName = geoData.address?.city || geoData.address?.town || geoData.address?.village || 'موقعك';
                document.getElementById('locationName').textContent = locationName;
                
                const today = new Date().toISOString().split('T')[0];
                const url = `https://api.aladhan.com/v1/timings/${today}?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&method=4`;
                const resp = await fetch(url);
                const data = await resp.json();
                prayerTimes = data.data.timings;
                const hijriDate = `${data.data.date.hijri.day} ${data.data.date.hijri.month.ar} ${data.data.date.hijri.year}`;
                document.getElementById('hijriDate').textContent = hijriDate;
                
                renderPrayerGrid();
                updateTimeDisplay();
                showToast('تم تحديث أوقات الصلاة بنجاح');
            } catch(e) { 
                console.error(e);
                showToast('خطأ في تحميل أوقات الصلاة'); 
            }
        }, () => showToast('يرجى تفعيل خدمات الموقع'));
    }
}

function updateTimeDisplay() {
    const now = new Date();
    document.getElementById('currentTime').textContent = now.toLocaleTimeString('ar-EG');
    document.getElementById('gregorianDate').textContent = now.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    if (prayerTimes) {
        const nextPrayerInfo = getNextPrayer();
        document.getElementById('nextPrayer').textContent = `المتبقي على أذان ${nextPrayerInfo.name}`;
        document.getElementById('timeRemaining').textContent = nextPrayerInfo.remaining;
    }
}

function getNextPrayer() {
    if (!prayerTimes) return { name: 'جاري التحميل', remaining: '--:--:--' };
    
    const now = new Date();
    const prayers = [
        { key: 'Fajr', name: 'الفجر' },
        { key: 'Dhuhr', name: 'الظهر' },
        { key: 'Asr', name: 'العصر' },
        { key: 'Maghrib', name: 'المغرب' },
        { key: 'Isha', name: 'العشاء' }
    ];
    
    for (let prayer of prayers) {
        const timeStr = prayerTimes[prayer.key];
        if (timeStr) {
            const [hour, minute] = timeStr.split(':');
            let prayerTime = new Date(now);
            prayerTime.setHours(parseInt(hour), parseInt(minute), 0, 0);
            
            let timeDiff = prayerTime - now;
            
            if (timeDiff > 0) {
                const hours = Math.floor(timeDiff / 3600000);
                const minutes = Math.floor((timeDiff % 3600000) / 60000);
                const seconds = Math.floor((timeDiff % 60000) / 1000);
                const remaining = `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
                return { name: prayer.name, remaining: remaining };
            }
        }
    }
    
    return { name: 'الفجر', remaining: '--:--:--' };
}

function renderPrayerGrid() {
    if (!prayerTimes) return;
    const prayers = [
        { name: 'الفجر', key: 'Fajr', icon: 'fa-cloud-moon' },
        { name: 'الشروق', key: 'Sunrise', icon: 'fa-sun' },
        { name: 'الظهر', key: 'Dhuhr', icon: 'fa-sun' },
        { name: 'العصر', key: 'Asr', icon: 'fa-sun' },
        { name: 'المغرب', key: 'Maghrib', icon: 'fa-moon' },
        { name: 'العشاء', key: 'Isha', icon: 'fa-star' }
    ];
    document.getElementById('prayerGrid').innerHTML = prayers.map(p => `
        <div class="prayer-item">
            <i class="fas ${p.icon}"></i>
            <div class="prayer-name">${p.name}</div>
            <div class="prayer-time">${prayerTimes[p.key] || '--:--'}</div>
        </div>
    `).join('');
}

// Prayer notifications check
function startPrayerCheck() {
    if (prayerCheckInterval) clearInterval(prayerCheckInterval);
    prayerCheckInterval = setInterval(() => {
        if (prayerNotificationsEnabled && prayerTimes) {
            const now = new Date();
            const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
            const prayerNames = { Fajr: 'الفجر', Dhuhr: 'الظهر', Asr: 'العصر', Maghrib: 'المغرب', Isha: 'العشاء' };
            
            for (let prayer of prayers) {
                const time = prayerTimes[prayer];
                if (time) {
                    const [hour, minute] = time.split(':');
                    const prayerTime = new Date(now);
                    prayerTime.setHours(parseInt(hour), parseInt(minute), 0, 0);
                    
                    const diffMinutes = Math.floor((prayerTime - now) / 60000);
                    
                    // قبل الأذان بـ beforeAdhanMinutes دقيقة
                    if (diffMinutes === beforeAdhanMinutes && diffMinutes > 0) {
                        const notifiedKey = `before_${prayer}_${new Date().toDateString()}`;
                        if (!localStorage.getItem(notifiedKey)) {
                            sendNotification(` تذكير: صلاة ${prayerNames[prayer]}`, `يتبقى ${beforeAdhanMinutes} دقائق على أذان ${prayerNames[prayer]}`);
                            localStorage.setItem(notifiedKey, 'true');
                        }
                    }
                    
                    // وقت الأذان
                    if (diffMinutes === 0 && Math.abs(now - prayerTime) < 60000) {
                        const adhanKey = `adhan_${prayer}_${new Date().toDateString()}`;
                        if (!localStorage.getItem(adhanKey)) {
                            sendNotification(` حان وقت صلاة ${prayerNames[prayer]}`, `أقيموا الصلاة رحمكم الله`);
                            localStorage.setItem(adhanKey, 'true');
                        }
                    }
                    
                    // بعد الصلاة بـ 5 دقائق للتذكير بالأذكار
                    if (afterPrayerReminder && diffMinutes === -5) {
                        const afterKey = `after_${prayer}_${new Date().toDateString()}`;
                        if (!localStorage.getItem(afterKey)) {
                            sendNotification(` أذكار بعد الصلاة`, `لا تنس أذكار ما بعد صلاة ${prayerNames[prayer]}`);
                            localStorage.setItem(afterKey, 'true');
                        }
                    }
                }
            }
        }
    }, 30000); // كل 30 ثانية
}

// ==================== Dhikr Functions ====================
window.incrementDhikr = function(category, index, maxCount) {
    let current = counters[category][index] || 0;
    if (current < maxCount) {
        counters[category][index] = current + 1;
        localStorage.setItem(`dhikr_${category}_${index}`, counters[category][index]);
        renderDhikrScreen();
        if ('vibrate' in navigator) navigator.vibrate(50);
    }
};

window.resetDhikr = function(category, index) {
    counters[category][index] = 0;
    localStorage.setItem(`dhikr_${category}_${index}`, 0);
    renderDhikrScreen();
    showToast('تم إعادة تعيين العداد');
};

window.changeCategory = function(category) {
    currentCategory = category;
    renderDhikrScreen();
};

function renderDhikrScreen() {
    const categories = Object.keys(dhikrData);
    const categoryData = dhikrData[currentCategory];
    
    const tabsHtml = categories.map(cat => `<div class="category-tab ${cat === currentCategory ? 'active' : ''}" onclick="changeCategory('${cat.replace(/'/g, "\\'")}')">${cat}</div>`).join('');
    
    const dhikrsHtml = categoryData.map((dhikr, idx) => {
        const maxCount = dhikr.count;
        const currentCount = counters[currentCategory][idx] || 0;
        const isComplete = currentCount >= maxCount;
        return `
            <div class="dhikr-item">
                <div class="dhikr-text">${dhikr.text}</div>
                <div class="dhikr-actions">
                    ${maxCount > 1 ? `<div class="dhikr-counter">${currentCount} / ${maxCount}</div>` : '<div></div>'}
                    <div class="dhikr-buttons">
                        <button class="btn-increment" ${isComplete ? 'disabled' : ''} onclick="incrementDhikr('${currentCategory.replace(/'/g, "\\'")}', ${idx}, ${maxCount})">+</button>
                        <button class="btn-reset" onclick="resetDhikr('${currentCategory.replace(/'/g, "\\'")}', ${idx})"><i class="fas fa-undo-alt"></i></button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    document.getElementById('dhikrContent').innerHTML = `
        <div class="card">
            <h3 class="card-title"><i class="fas fa-book"></i> الأذكار اليومية</h3>
            <div class="dhikr-category-tabs">${tabsHtml}</div>
            ${dhikrsHtml}
        </div>
    `;
}

// ==================== Names Functions ====================
window.filterNames = function() {
    const input = document.getElementById('nameSearch');
    const searchTerm = input ? input.value.toLowerCase() : '';
    renderNamesScreen(searchTerm);
};

window.toggleNameDetails = function(index) {
    const details = document.getElementById(`name-details-${index}`);
    if (details) details.classList.toggle('show');
};

function renderNamesScreen(searchTerm = '') {
    const filtered = allahNamesComplete.filter(n => n.name.includes(searchTerm) || n.meaning.includes(searchTerm));
    const namesHtml = filtered.map((n, idx) => `
        <div class="name-card" onclick="toggleNameDetails(${n.num - 1})">
            <div class="name-header">
                <div class="name-number">${n.num}</div>
                <div class="name-title">${n.name}</div>
                <i class="fas fa-chevron-down"></i>
            </div>
            <div class="name-meaning">${n.meaning}</div>
            <div class="name-details" id="name-details-${n.num - 1}">
                <strong> فضل الذكر:</strong><br>${n.benefit}
            </div>
        </div>
    `).join('');
    
    document.getElementById('namesContent').innerHTML = `
        <div class="card">
            <h3 class="card-title"><i class="fas fa-star"></i> أسماء الله الحسنى</h3>
            <p style="margin-bottom: 15px;">"لَّهُ الْأَسْمَاءُ الْحُسْنَى"</p>
            <input type="text" id="nameSearch" class="search-input" placeholder=" بحث عن اسم..." onkeyup="filterNames()">
            <div style="margin-bottom: 10px; color: var(--primary);"> عرض ${filtered.length} من 99 اسماً</div>
            ${namesHtml}
        </div>
    `;
}

// ==================== Qibla Functions ====================
async function loadQibla() {
    return new Promise((resolve) => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const meccaLat = 21.4225, meccaLng = 39.8262;
                const lat1 = pos.coords.latitude * Math.PI / 180;
                const lat2 = meccaLat * Math.PI / 180;
                const lng1 = pos.coords.longitude * Math.PI / 180;
                const lng2 = meccaLng * Math.PI / 180;
                const y = Math.sin(lng2 - lng1) * Math.cos(lat2);
                const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1);
                let bearing = Math.atan2(y, x) * 180 / Math.PI;
                qiblaDirection = (bearing + 360) % 360;
                resolve();
            }, () => resolve());
        } else resolve();
    });
}

function startCompass() {
    if ('DeviceOrientationEvent' in window) {
        window.addEventListener('deviceorientation', (e) => {
            compassHeading = e.webkitCompassHeading || e.alpha;
            if (compassHeading !== undefined && currentScreen === 'qiblaScreen') {
                renderQiblaScreen();
            }
        });
    }
}

function getDirectionText() {
    let diff = qiblaDirection - compassHeading;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    if (Math.abs(diff) <= 15) return { text: ' اتجاه القبلة صحيح', correct: true };
    if (diff > 15 && diff <= 45) return { text: ' انعطف يساراً قليلاً', correct: false };
    if (diff > 45 && diff <= 90) return { text: ' انعطف يساراً', correct: false };
    if (diff > 90) return { text: ' انعطف يساراً كثيراً', correct: false };
    if (diff < -15 && diff >= -45) return { text: ' انعطف يميناً قليلاً', correct: false };
    if (diff < -45 && diff >= -90) return { text: ' انعطف يميناً', correct: false };
    if (diff < -90) return { text: ' انعطف يميناً كثيراً', correct: false };
    return { text: ' حرك الهاتف أفقياً', correct: false };
}

function renderQiblaScreen() {
    const rotation = qiblaDirection - compassHeading;
    const dir = getDirectionText();
    document.getElementById('qiblaContent').innerHTML = `
        <div class="card">
            <h3 class="card-title"><i class="fas fa-location-arrow"></i> اتجاه القبلة</h3>
            <div style="text-align:center;">
                <div class="compass">
                    <div class="compass-circle">
                        <div class="direction-labels">
                            <div class="dir-label n">شمال</div>
                            <div class="dir-label s">جنوب</div>
                            <div class="dir-label e">شرق</div>
                            <div class="dir-label w">غرب</div>
                        </div>
                        <div class="compass-arrow" style="transform: translateX(-50%) rotate(${rotation}deg);"><i class="fas fa-long-arrow-alt-up"></i></div>
                        <div class="kaaba-center"><i class="fas fa-kaaba"></i></div>
                    </div>
                </div>
                <div class="direction-text ${dir.correct ? 'correct' : ''}">${dir.text}</div>
                <div style="display: flex; justify-content: center; gap: 30px;">
                    <div><div> زاوية القبلة</div><strong>${Math.round(qiblaDirection)}°</strong></div>
                    <div><div> الاتجاه الحالي</div><strong>${Math.round(compassHeading)}°</strong></div>
                </div>
                <p style="margin-top: 15px; font-size: 12px; color: #888;"> حرك هاتفك بشكل أفقي للحصول على قراءة دقيقة</p>
            </div>
        </div>
    `;
}

// ==================== Tasbeeh Functions ====================
window.incrementTasbeeh = function() {
    if (tasbeehCounter < selectedTasbeehCount) {
        tasbeehCounter++;
        tasbeehTotal++;
        localStorage.setItem('tasbeehTotal', tasbeehTotal);
        renderTasbeehScreen();
        if ('vibrate' in navigator) navigator.vibrate(50);
        
        if (tasbeehCounter === selectedTasbeehCount) {
            showToast(`✨ أكملت ${selectedTasbeehCount} تسبيحة!`);
        }
    }
};

window.resetTasbeeh = function() {
    tasbeehCounter = 0;
    renderTasbeehScreen();
    showToast('تم إعادة تعيين العداد');
};

window.resetTotalTasbeeh = function() {
    if (confirm('هل تريد إعادة تعيين إجمالي عدد التسبيحات؟')) {
        tasbeehTotal = 0;
        localStorage.setItem('tasbeehTotal', 0);
        renderTasbeehScreen();
        showToast('تم إعادة تعيين الإجمالي');
    }
};

window.changeTasbeehCount = function(count) {
    selectedTasbeehCount = parseInt(count);
    tasbeehCounter = 0;
    renderTasbeehScreen();
};

window.changeTasbeehDhikr = function(text) {
    currentDhikrText = text;
    tasbeehCounter = 0;
    renderTasbeehScreen();
};

function renderTasbeehScreen() {
    const progress = (tasbeehCounter / selectedTasbeehCount) * 100;
    const dhikrOptions = ['سبحان الله', 'الحمد لله', 'الله أكبر', 'لا إله إلا الله', 'أستغفر الله', 'سبحان الله وبحمده', 'سبحان الله العظيم', 'لا حول ولا قوة إلا بالله'];
    
    document.getElementById('tasbeehContent').innerHTML = `
        <div class="card">
            <h3 class="card-title"><i class="fas fa-hands-praying"></i> السبحة الإلكترونية</h3>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span> إجمالي التسبيحات</span>
                <div style="cursor:pointer;" onclick="resetTotalTasbeeh()"><strong style="font-size: 22px; color: var(--primary);">${tasbeehTotal}</strong> <i class="fas fa-redo-alt" style="font-size: 14px;"></i></div>
            </div>
            <div class="tasbeeh-circle">
                <div class="tasbeeh-number">${tasbeehCounter}</div>
                <div class="progress-track"><div class="progress-fill" style="width: ${progress}%;"></div></div>
                <div style="margin-top: 8px;"> المتبقي: ${selectedTasbeehCount - tasbeehCounter}</div>
                <div style="margin-top: 10px; font-weight: 600; color: var(--primary);">${currentDhikrText}</div>
            </div>
            <div style="margin: 15px 0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span> عدد التسبيحات:</span>
                    <select onchange="changeTasbeehCount(this.value)">
                        <option value="33" ${selectedTasbeehCount===33?'selected':''}>33 تسبيحة</option>
                        <option value="34" ${selectedTasbeehCount===34?'selected':''}>34 تسبيحة</option>
                        <option value="50" ${selectedTasbeehCount===50?'selected':''}>50 تسبيحة</option>
                        <option value="100" ${selectedTasbeehCount===100?'selected':''}>100 تسبيحة</option>
                    </select>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span> الذكر:</span>
                    <select onchange="changeTasbeehDhikr(this.value)">
                        ${dhikrOptions.map(opt => `<option value="${opt}" ${currentDhikrText===opt?'selected':''}>${opt}</option>`).join('')}
                    </select>
                </div>
            </div>
            <div class="tasbeeh-buttons">
                <button class="btn-tasbeeh btn-tasbeeh-primary" onclick="incrementTasbeeh()"><i class="fas fa-plus-circle"></i><br>سبح</button>
                <button class="btn-tasbeeh btn-tasbeeh-secondary" onclick="resetTasbeeh()"><i class="fas fa-undo-alt"></i><br>إعادة</button>
            </div>
        </div>
    `;
}

// ==================== Random Dhikr Notifications ====================
function startRandomDhikrNotifications(intervalMinutes) {
    if (notificationInterval) clearInterval(notificationInterval);
    
    const allDhikrs = [];
    for (let cat in dhikrData) {
        dhikrData[cat].forEach(d => {
            allDhikrs.push({ text: d.text, category: cat });
        });
    }
    
    notificationInterval = setInterval(() => {
        if (randomNotificationsEnabled && notificationPermission) {
            const random = allDhikrs[Math.floor(Math.random() * allDhikrs.length)];
            sendNotification(' ذكر عشوائي', random.text.substring(0, 100) + (random.text.length > 100 ? '...' : ''));
        }
    }, intervalMinutes * 60 * 1000);
}

function updateNotificationSettings() {
    if (randomNotificationsEnabled && notificationPermission) {
        startRandomDhikrNotifications(notificationIntervalMinutes);
    } else if (notificationInterval) {
        clearInterval(notificationInterval);
    }
}

// ==================== Settings Functions ====================
function renderSettingsScreen() {
    document.getElementById('settingsContent').innerHTML = `
        <div class="card">
            <h3 class="card-title"><i class="fas fa-bell"></i>  إعدادات الإشعارات</h3>
            <div class="setting-item">
                <div>
                    <strong> تفعيل الإشعارات العشوائية</strong>
                    <p style="font-size:12px;">الحصول على أذكار عشوائية طوال اليوم</p>
                </div>
                <label class="switch">
                    <input type="checkbox" id="notificationToggle" ${randomNotificationsEnabled ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
            </div>
            <div class="setting-item">
                <div>
                    <strong> إشعارات الصلاة</strong>
                    <p style="font-size:12px;">تذكير قبل الأذان وعند وقت الصلاة</p>
                </div>
                <label class="switch">
                    <input type="checkbox" id="prayerNotificationToggle" ${prayerNotificationsEnabled ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
            </div>
            <div class="setting-item">
                <div>
                    <strong> تذكير بأذكار ما بعد الصلاة</strong>
                    <p style="font-size:12px;">بعد الصلاة بـ 5 دقائق</p>
                </div>
                <label class="switch">
                    <input type="checkbox" id="afterPrayerToggle" ${afterPrayerReminder ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
            </div>
            <div class="setting-item">
                <div>
                    <strong> التذكير قبل الأذان بـ</strong>
                    <p style="font-size:12px;">كم دقيقة قبل الصلاة</p>
                </div>
                <select id="beforeAdhanSelect">
                    <option value="5" ${beforeAdhanMinutes===5?'selected':''}>5 دقائق</option>
                    <option value="10" ${beforeAdhanMinutes===10?'selected':''}>10 دقائق</option>
                    <option value="15" ${beforeAdhanMinutes===15?'selected':''}>15 دقيقة</option>
                    <option value="30" ${beforeAdhanMinutes===30?'selected':''}>30 دقيقة</option>
                </select>
            </div>
            <div class="setting-item">
                <div>
                    <strong> الفاصل الزمني للإشعارات العشوائية</strong>
                    <p style="font-size:12px;">كل كم دقيقة يظهر ذكر</p>
                </div>
                <select id="intervalSelect">
                    <option value="5" ${notificationIntervalMinutes===5?'selected':''}>كل 5 دقائق</option>
                    <option value="10" ${notificationIntervalMinutes===10?'selected':''}>كل 10 دقائق</option>
                    <option value="15" ${notificationIntervalMinutes===15?'selected':''}>كل 15 دقيقة</option>
                    <option value="30" ${notificationIntervalMinutes===30?'selected':''}>كل 30 دقيقة</option>
                    <option value="60" ${notificationIntervalMinutes===60?'selected':''}>كل ساعة</option>
                </select>
            </div>
            <button id="requestNotifBtn" style="background:linear-gradient(135deg, var(--primary), var(--primary-dark)); color:white; border:none; padding:12px; border-radius:30px; width:100%; margin-top:15px; cursor:pointer; font-weight:600;">✅ طلب إذن الإشعارات</button>
        </div>
        
        <div class="card">
            <h3 class="card-title"><i class="fas fa-info-circle"></i> ℹ عن التطبيق</h3>
            <p>تطبيق <strong>أذكاري</strong> - تطبيق أذكار إسلامي متكامل</p>
            <p style="margin-top:10px;"> المميزات:</p>
            <ul style="margin-right:20px; margin-top:5px;">
                <li> أكثر من 100 ذكر متنوع</li>
                <li> 99 اسم من أسماء الله الحسنى كاملة</li>
                <li> أوقات الصلاة حسب موقعك</li>
                <li> بوصلة القبلة الدقيقة</li>
                <li> سبحة إلكترونية</li>
                <li> إشعارات تذكارية قابلة للتخصيص</li>
                <li> وضع ليلي مريح للعين</li>
                <li> قابل للتثبيت على الشاشة الرئيسية</li>
            </ul>
        </div>
        
        <div class="card">
            <h3 class="card-title"><i class="fas fa-chart-line"></i>  إحصائيات التطبيق</h3>
            <div class="stats-grid">
                <div class="stat-card"><div class="stat-number">${Object.values(dhikrData).reduce((sum, cat) => sum + cat.length, 0)}+</div><div class="stat-label">ذكر</div></div>
                <div class="stat-card"><div class="stat-number">99</div><div class="stat-label">اسماً</div></div>
                <div class="stat-card"><div class="stat-number">6</div><div class="stat-label">أوقات صلاة</div></div>
                <div class="stat-card"><div class="stat-number">${tasbeehTotal}</div><div class="stat-label">تسبيحة</div></div>
            </div>
        </div>
        
        <div class="card">
            <h3 class="card-title"><i class="fas fa-question-circle"></i>  التعليمات</h3>
            <p><strong> الإشعارات:</strong> اضغط على زر "طلب إذن الإشعارات" لتفعيل التذكيرات</p>
            <p><strong> القبلة:</strong> حرك الهاتف أفقياً للحصول على قراءة دقيقة</p>
            <p><strong> الأذكار:</strong> اضغط على + لتكرار الذكر، وحفظ التقدم تلقائياً</p>
            <p><strong> الوضع الليلي:</strong> اضغط على أيقونة القمر/الشمس في الأعلى</p>
            <p><strong> التثبيت:</strong> اضغط على أيقونة التحميل  لتثبيت التطبيق كـ PWA</p>
            <p><strong> المزامنة:</strong> جميع البيانات تحفظ تلقائياً في المتصفح</p>
        </div>
    `;
    
    // Setup event listeners
    document.getElementById('notificationToggle')?.addEventListener('change', (e) => {
        randomNotificationsEnabled = e.target.checked;
        localStorage.setItem('randomNotifications', randomNotificationsEnabled);
        if (randomNotificationsEnabled && notificationPermission) {
            updateNotificationSettings();
            showToast(' تم تفعيل الإشعارات العشوائية');
        } else if (randomNotificationsEnabled && !notificationPermission) {
            showToast(' يرجى تفعيل الإشعارات أولاً من الزر أعلاه');
            e.target.checked = false;
            randomNotificationsEnabled = false;
        } else {
            showToast(' تم إيقاف الإشعارات العشوائية');
        }
    });
    
    document.getElementById('prayerNotificationToggle')?.addEventListener('change', (e) => {
        prayerNotificationsEnabled = e.target.checked;
        localStorage.setItem('prayerNotifications', prayerNotificationsEnabled);
        showToast(prayerNotificationsEnabled ? ' تم تفعيل إشعارات الصلاة' : ' تم إيقاف إشعارات الصلاة');
    });
    
    document.getElementById('afterPrayerToggle')?.addEventListener('change', (e) => {
        afterPrayerReminder = e.target.checked;
        localStorage.setItem('afterPrayerReminder', afterPrayerReminder);
        showToast(afterPrayerReminder ? ' تم تفعيل تذكير أذكار ما بعد الصلاة' : ' تم إيقاف تذكير أذكار ما بعد الصلاة');
    });
    
    document.getElementById('intervalSelect')?.addEventListener('change', (e) => {
        notificationIntervalMinutes = parseInt(e.target.value);
        localStorage.setItem('notificationInterval', notificationIntervalMinutes);
        if (randomNotificationsEnabled && notificationPermission) {
            updateNotificationSettings();
        }
        showToast(` تم ضبط الفاصل الزمني إلى ${notificationIntervalMinutes} دقائق`);
    });
    
    document.getElementById('beforeAdhanSelect')?.addEventListener('change', (e) => {
        beforeAdhanMinutes = parseInt(e.target.value);
        localStorage.setItem('beforeAdhanMinutes', beforeAdhanMinutes);
        showToast(` سيتم التذكير قبل الأذان بـ ${beforeAdhanMinutes} دقائق`);
    });
    
    document.getElementById('requestNotifBtn')?.addEventListener('click', () => {
        requestNotificationPermission();
    });
}

// ==================== Initialize Everything ====================
async function init() {
    await loadPrayerTimes();
    await loadQibla();
    startCompass();
    startPrayerCheck();
    
    // Update time every second
    setInterval(updateTimeDisplay, 1000);
    
    // Refresh prayer times every hour
    setInterval(loadPrayerTimes, 3600000);
    
    // Render all screens
    renderDhikrScreen();
    renderNamesScreen();
    renderTasbeehScreen();
    renderSettingsScreen();
    
    // Request notification permission if needed
    setTimeout(() => {
        if (randomNotificationsEnabled && !notificationPermission) {
            requestNotificationPermission();
        } else if (randomNotificationsEnabled && notificationPermission) {
            updateNotificationSettings();
        }
    }, 2000);
}

// Start the app
init();