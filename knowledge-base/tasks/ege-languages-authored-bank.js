const SOURCE = "Авторский материал · линия и способ ответа сверены со спецификацией ФИПИ-2026";

const titles = {
  english: "Английский язык",
  german: "Немецкий язык",
  french: "Французский язык",
  spanish: "Испанский язык",
  chinese: "Китайский язык",
};

function auto(slug, variant, line, topic, prompt, answer, solution, extra = {}) {
  return {
    id: `${slug}-v${variant}-${line}`,
    subject: titles[slug],
    number: `Задание ${line}`,
    examYear: 2026,
    sourceLabel: SOURCE,
    difficulty: line >= 30 ? "повышенный" : "базовый",
    topic,
    theory: extra.theory ?? "Определите коммуникативную задачу, найдите языковые маркеры и проверьте форму ответа по контексту.",
    prompt: `${prompt}\n\nНомер тренировочного варианта: ${variant}.`,
    kind: extra.kind ?? "text",
    format: extra.format ?? "краткий ответ",
    interaction: "exam-blank",
    answer: String(answer),
    solution,
    options: extra.options,
    stimulus: extra.stimulus,
    audioText: extra.audioText,
    answerOrder: extra.answerOrder,
    maxScore: extra.maxScore ?? 1,
    responseInstruction: extra.responseInstruction ?? "Запишите ответ без пробелов и дополнительных символов.",
    resourceStatus: extra.resourceStatus,
  };
}

function reviewed(slug, variant, line, topic, prompt, solution, maxScore, extra = {}) {
  return {
    id: `${slug}-v${variant}-${line}`,
    subject: titles[slug],
    number: `Задание ${line}`,
    examYear: 2026,
    sourceLabel: SOURCE,
    difficulty: "высокий",
    topic,
    theory: extra.theory ?? "Сначала выполните все пункты коммуникативной задачи, затем проверьте организацию текста, лексику, грамматику и объём.",
    prompt: `${prompt}\n\nНомер тренировочного варианта: ${variant}.`,
    kind: extra.kind ?? "extended",
    format: extra.format ?? "развёрнутый ответ",
    interaction: "teacher-review",
    answer: "teacher-review",
    solution,
    stimulus: extra.stimulus,
    audioText: extra.audioText,
    maxScore,
    responseInstruction: extra.responseInstruction ?? "Выполните задание полностью; ответ проверяется по критериям ФИПИ.",
    resourceStatus: extra.resourceStatus,
  };
}

const packs = {
  english: {
    matchAudio: "Speaker 1: I cycle because it is quick and keeps me fit. Speaker 2: The underground is reliable, though crowded. Speaker 3: I walk to school and enjoy the fresh air. Speaker 4: My father drives me when it rains. Speaker 5: The bus is cheap but often late.",
    detailAudio: "Last March our school started an environmental project. One hundred and twenty students joined it. We wanted to reduce plastic waste, but at first we did not have enough recycling bins. A local company donated the bins. During the first month we collected eighty-five kilograms of plastic. Next term we are going to create a small school garden.",
    reading: "A community library in Bristol used to close early because few teenagers visited it. In 2024 the librarians asked local students what they needed. The students suggested evening opening hours, study tables and short workshops on digital skills. Six months after the changes, teenage membership had doubled. The library now invites students to plan its monthly programme, so the service continues to change with the community.",
    statements: ["The project began in March.", "Only 102 students joined it.", "The school had enough recycling bins from the start.", "A local company helped the school.", "Students collected 85 kilograms in the first month.", "The school garden was already open in March.", "The school sold the collected plastic abroad."],
    grammar: [
      ["Yesterday Mia ___ to the new library. (GO)", "went"],
      ["It was the ___ place to prepare for the test. (GOOD)", "best"],
      ["Several ___ were working in the reading room. (CHILD)", "children"],
      ["By six o'clock they ___ the whole presentation. (FINISH)", "hadfinished"],
      ["If I ___ closer, I would visit it every day. (LIVE)", "lived"],
      ["Mia enjoys ___ part in workshops. (TAKE)", "taking"],
    ],
    formation: [
      ["The project was very ___. (SUCCESS)", "successful"],
      ["The old timetable was ___. (CONVENIENT)", "inconvenient"],
      ["Students showed great ___. (CREATE)", "creativity"],
      ["A local ___ led the workshop. (SCIENCE)", "scientist"],
      ["The new rooms are bright and ___. (COMFORT)", "comfortable"],
    ],
    lexical: [
      ["The librarians decided to ___ attention to student ideas.", ["pay", "give", "take", "make"], "1"],
      ["The workshops are in great ___.", ["request", "demand", "needless", "order"], "2"],
      ["Students can ___ use of free computers.", ["do", "make", "set", "put"], "2"],
      ["The library keeps ___ with new technology.", ["pace", "speed", "step", "road"], "1"],
      ["The project turned ___ to be successful.", ["up", "out", "over", "off"], "2"],
      ["Visitors are asked to ___ in advance.", ["book", "write", "reserve up", "occupy"], "1"],
      ["The changes had a positive ___ on attendance.", ["effect", "affect", "resulting", "cause"], "1"],
    ],
    email: "You have received an email from your English-speaking friend Alex, who writes: “Our school is opening a media club. What school clubs do you have? Which one would you join and why? How much free time do you have?” Write an email to Alex (100–140 words) and ask three questions about the media club.",
    report: "Imagine that you are doing a project on how teenagers in Zetland prepare for exams. Table: online practice — 38%; school lessons — 27%; private tutor — 18%; study group — 10%; printed books — 7%. Write a 200–250 word report following the examination plan.",
    oral: "Young people often combine online learning with face-to-face lessons. Digital tools make practice flexible, while a teacher can explain difficult points and give personal feedback.",
  },
  german: {
    matchAudio: "Sprecher 1: Ich fahre mit dem Fahrrad, weil es schnell ist. Sprecher 2: Die U-Bahn ist zuverlässig, aber voll. Sprecher 3: Ich gehe zu Fuß und genieße die frische Luft. Sprecher 4: Bei Regen fährt mich mein Vater. Sprecher 5: Der Bus ist billig, kommt aber oft zu spät.",
    detailAudio: "Im März startete unsere Schule ein Umweltprojekt. Hundertzwanzig Schülerinnen und Schüler machten mit. Wir wollten weniger Plastik benutzen, hatten aber zuerst nicht genug Sammelbehälter. Eine Firma schenkte uns neue Behälter. Im ersten Monat sammelten wir fünfundachtzig Kilogramm Plastik. Im nächsten Halbjahr wollen wir einen Schulgarten anlegen.",
    reading: "Eine Stadtbibliothek in Köln schloss früher sehr früh, weil nur wenige Jugendliche kamen. Die Bibliothek fragte Schülerinnen und Schüler nach ihren Wünschen. Sie schlugen längere Öffnungszeiten, Arbeitsplätze und kurze Computerkurse vor. Nach sechs Monaten hatte sich die Zahl der jungen Mitglieder verdoppelt. Heute planen Jugendliche das Monatsprogramm mit.",
    statements: ["Das Projekt begann im März.", "Nur 102 Jugendliche nahmen teil.", "Am Anfang gab es genug Sammelbehälter.", "Eine lokale Firma half der Schule.", "Im ersten Monat wurden 85 Kilogramm gesammelt.", "Der Schulgarten war schon im März fertig.", "Die Schule verkaufte das Plastik ins Ausland."],
    grammar: [
      ["Gestern ___ Lena in die neue Bibliothek. (GEHEN)", "ging"],
      ["Sie ist der ___ Ort zum Lernen. (GUT)", "beste"],
      ["Viele ___ arbeiteten dort. (KIND)", "Kinder"],
      ["Bis sechs Uhr ___ sie die Aufgabe beendet. (HABEN)", "hatten"],
      ["Wenn ich näher ___, käme ich täglich. (WOHNEN)", "wohnte"],
      ["Lena interessiert sich für das ___ in Gruppen. (LERNEN)", "Lernen"],
    ],
    formation: [
      ["Das Projekt war sehr ___. (ERFOLG)", "erfolgreich"],
      ["Der alte Plan war ___. (PRAKTISCH)", "unpraktisch"],
      ["Die Jugendlichen arbeiteten ___. (KREATIVITÄT)", "kreativ"],
      ["Ein ___ leitete den Kurs. (WISSENSCHAFT)", "Wissenschaftler"],
      ["Die Räume sind hell und ___. (KOMFORT)", "komfortabel"],
    ],
    lexical: [
      ["Die Bibliothek legt großen Wert ___ Ideen.", ["an", "auf", "in", "für"], "2"],
      ["Der Kurs findet zweimal ___ Woche statt.", ["am", "die", "pro", "zu"], "3"],
      ["Jugendliche nehmen aktiv ___ Programm teil.", ["am", "im", "zum", "beim"], "1"],
      ["Die Änderungen kamen gut ___.", ["an", "aus", "ein", "vor"], "1"],
      ["Man muss sich vorher ___.", ["anmelden", "zumelden", "melden an", "einmelden"], "1"],
      ["Das Angebot steht allen zur ___.", ["Wahl", "Verfügung", "Ordnung", "Stelle"], "2"],
      ["Die Zahl der Besucher nahm deutlich ___.", ["zu", "ab", "mit", "vor"], "1"],
    ],
    email: "Du hast eine E-Mail von deinem deutschen Freund Max bekommen: „Unsere Schule eröffnet einen Medienklub. Welche AGs gibt es an deiner Schule? Welche würdest du wählen und warum? Wie viel Freizeit hast du?“ Schreibe Max eine E-Mail (100–140 Wörter) und stelle drei Fragen zum Medienklub.",
    report: "Projekt: Wie bereiten sich Jugendliche in Zetland auf Prüfungen vor? Online-Übungen — 38%; Schulunterricht — 27%; Nachhilfe — 18%; Lerngruppe — 10%; gedruckte Bücher — 7%. Verfasse einen Bericht von 200–250 Wörtern nach dem Prüfungsplan.",
    oral: "Viele Jugendliche verbinden digitales Lernen mit Unterricht im Klassenraum. Digitale Angebote machen das Üben flexibel, während eine Lehrkraft schwierige Fragen erklären kann.",
  },
  french: {
    matchAudio: "Locuteur 1 : Je vais à vélo parce que c'est rapide. Locuteur 2 : Le métro est fiable mais bondé. Locuteur 3 : Je vais à pied et j'aime l'air frais. Locuteur 4 : Quand il pleut, mon père m'emmène. Locuteur 5 : Le bus n'est pas cher mais il est souvent en retard.",
    detailAudio: "En mars, notre école a lancé un projet écologique. Cent vingt élèves y ont participé. Nous voulions réduire les déchets plastiques, mais au début il n'y avait pas assez de conteneurs. Une entreprise locale nous en a offert. Pendant le premier mois, nous avons collecté quatre-vingt-cinq kilos de plastique. Le trimestre prochain, nous allons créer un petit jardin scolaire.",
    reading: "Une bibliothèque municipale de Lyon fermait tôt parce que peu d'adolescents la fréquentaient. Les bibliothécaires ont demandé leur avis aux élèves. Ceux-ci ont proposé des horaires du soir, des tables de travail et de petits ateliers numériques. Six mois plus tard, le nombre de jeunes abonnés avait doublé. Aujourd'hui, ils participent au programme mensuel.",
    statements: ["Le projet a commencé en mars.", "Seulement 102 élèves y ont participé.", "Au début, il y avait assez de conteneurs.", "Une entreprise locale a aidé l'école.", "Les élèves ont collecté 85 kilos le premier mois.", "Le jardin existait déjà en mars.", "L'école a vendu le plastique à l'étranger."],
    grammar: [
      ["Hier, Léa ___ à la nouvelle bibliothèque. (ALLER)", "estallée"],
      ["C'est le ___ endroit pour réviser. (BON)", "meilleur"],
      ["Plusieurs ___ travaillaient dans la salle. (ENFANT)", "enfants"],
      ["À six heures, ils ___ le projet. (FINIR)", "avaientfini"],
      ["Si j'___ plus près, j'y viendrais chaque jour. (HABITER)", "habitais"],
      ["Léa aime ___ aux ateliers. (PARTICIPER)", "participer"],
    ],
    formation: [
      ["Le projet a connu un grand ___. (SUCCÉDER)", "succès"],
      ["L'ancien horaire était ___. (PRATIQUE)", "impratique"],
      ["Les élèves ont travaillé avec ___. (CRÉATIF)", "créativité"],
      ["Un jeune ___ a animé l'atelier. (SCIENCE)", "scientifique"],
      ["Les nouvelles salles sont très ___. (CONFORT)", "confortables"],
    ],
    lexical: [
      ["Les élèves ont ___ une proposition.", ["fait", "mis", "pris", "donné"], "1"],
      ["Le projet a ___ du succès.", ["connu", "su", "pris", "appris"], "1"],
      ["Il faut s'inscrire ___ avance.", ["en", "à", "par", "sur"], "1"],
      ["La bibliothèque tient compte ___ avis.", ["des", "aux", "les", "par"], "1"],
      ["Les jeunes prennent ___ aux décisions.", ["part", "place", "rôle", "action"], "1"],
      ["Les changements ont eu un effet positif ___ la fréquentation.", ["sur", "à", "de", "pour"], "1"],
      ["L'offre répond ___ besoins des élèves.", ["aux", "des", "les", "avec"], "1"],
    ],
    email: "Tu as reçu un courriel de ton ami français Lucas : « Notre école ouvre un club média. Quels clubs existe-t-il dans ton école ? Lequel choisirais-tu et pourquoi ? Combien de temps libre as-tu ? » Écris 100–140 mots et pose trois questions sur le club média.",
    report: "Projet : comment les adolescents de Zetland préparent-ils leurs examens ? Exercices en ligne — 38%; cours scolaires — 27%; professeur particulier — 18%; groupe d'étude — 10%; livres imprimés — 7%. Rédige un rapport de 200–250 mots.",
    oral: "Les jeunes associent souvent l'apprentissage numérique aux cours en classe. Les outils en ligne offrent de la souplesse, tandis qu'un professeur explique les difficultés.",
  },
  spanish: {
    matchAudio: "Hablante 1: Voy en bicicleta porque es rápido. Hablante 2: El metro es fiable, aunque está lleno. Hablante 3: Voy andando y disfruto del aire fresco. Hablante 4: Cuando llueve, me lleva mi padre. Hablante 5: El autobús es barato, pero suele llegar tarde.",
    detailAudio: "En marzo nuestra escuela inició un proyecto ecológico. Participaron ciento veinte alumnos. Queríamos reducir los residuos de plástico, pero al principio no había suficientes contenedores. Una empresa local nos regaló varios. Durante el primer mes recogimos ochenta y cinco kilos de plástico. El próximo trimestre vamos a crear un pequeño jardín escolar.",
    reading: "Una biblioteca municipal de Valencia cerraba temprano porque pocos adolescentes la visitaban. Los bibliotecarios preguntaron a los estudiantes qué necesitaban. Propusieron abrir por la tarde, poner mesas de estudio y organizar talleres digitales. Seis meses después, el número de socios jóvenes se había duplicado. Ahora los estudiantes ayudan a planificar el programa mensual.",
    statements: ["El proyecto empezó en marzo.", "Solo participaron 102 alumnos.", "Al principio había suficientes contenedores.", "Una empresa local ayudó al colegio.", "El primer mes recogieron 85 kilos.", "El jardín ya estaba abierto en marzo.", "El colegio vendió el plástico al extranjero."],
    grammar: [
      ["Ayer Marta ___ a la nueva biblioteca. (IR)", "fue"],
      ["Era el ___ lugar para estudiar. (BUENO)", "mejor"],
      ["Varios ___ trabajaban allí. (JOVEN)", "jóvenes"],
      ["A las seis ya ___ el proyecto. (TERMINAR)", "habíanterminado"],
      ["Si yo ___ más cerca, iría cada día. (VIVIR)", "viviera"],
      ["A Marta le gusta ___ en los talleres. (PARTICIPAR)", "participar"],
    ],
    formation: [
      ["El proyecto tuvo mucho ___. (EXITOSO)", "éxito"],
      ["El horario anterior era poco ___. (PRÁCTICA)", "práctico"],
      ["Los alumnos mostraron gran ___. (CREATIVO)", "creatividad"],
      ["Un ___ dirigió el taller. (CIENCIA)", "científico"],
      ["Las salas nuevas son muy ___. (COMODIDAD)", "cómodas"],
    ],
    lexical: [
      ["Los estudiantes ___ una propuesta.", ["hicieron", "pusieron", "dieron", "tomaron"], "1"],
      ["El proyecto tuvo ___ éxito.", ["gran", "alto", "largo", "fuerte"], "1"],
      ["Hay que inscribirse ___ antelación.", ["con", "por", "a", "de"], "1"],
      ["La biblioteca tiene ___ cuenta las opiniones.", ["en", "a", "de", "por"], "1"],
      ["Los jóvenes toman ___ en las decisiones.", ["parte", "sitio", "lugar", "acción"], "1"],
      ["Los cambios influyeron ___ la asistencia.", ["en", "a", "de", "con"], "1"],
      ["La oferta responde ___ las necesidades.", ["a", "con", "de", "por"], "1"],
    ],
    email: "Has recibido un correo de tu amigo español Pablo: «Nuestro colegio abre un club de medios. ¿Qué clubes hay en tu centro? ¿Cuál elegirías y por qué? ¿Cuánto tiempo libre tienes?» Escribe 100–140 palabras y haz tres preguntas sobre el club.",
    report: "Proyecto: ¿cómo se preparan los adolescentes de Zetland para los exámenes? Práctica en línea — 38%; clases — 27%; profesor particular — 18%; grupo de estudio — 10%; libros impresos — 7%. Escribe un informe de 200–250 palabras.",
    oral: "Los jóvenes suelen combinar el aprendizaje digital con las clases presenciales. Las herramientas en línea permiten practicar con flexibilidad y el profesor puede explicar las dificultades.",
  },
};

const languageUi = {
  english: {
    transport: ["travelling by bicycle", "travelling by underground", "walking", "travelling by car", "travelling by bus", "travelling by train"],
    headings: ["A quiet place from the past", "Why libraries are unnecessary", "A library changed by teenagers", "Rules for borrowing books"],
    gap: ["The students suggested several changes. ___, teenage membership doubled.", ["In contrast", "Six months later", "For example", "Unless"]],
    readingOptions: [
      ["because few teenagers visited", "because books were missing", "because staff were on holiday", "because the building was unsafe"],
      ["local students", "tourists", "university professors", "shop owners"],
      ["evening opening hours", "closing at noon", "Sunday-only opening", "shorter weekdays"],
      ["study tables", "a swimming pool", "a café only", "a cinema"],
      ["it fell by half", "it stayed unchanged", "it grew slightly", "it doubled"],
      ["students", "only the mayor", "book publishers", "sports coaches"],
      ["a history of Bristol", "rules for quiet reading", "a service changed with teenagers", "why digital skills are harmful"],
    ],
  },
  german: {
    transport: ["mit dem Fahrrad", "mit der U-Bahn", "zu Fuß", "mit dem Auto", "mit dem Bus", "mit dem Zug"],
    headings: ["Ein stiller Ort aus der Vergangenheit", "Warum Bibliotheken unnötig sind", "Eine von Jugendlichen veränderte Bibliothek", "Regeln für die Buchausleihe"],
    gap: ["Die Jugendlichen schlugen mehrere Änderungen vor. ___ hatte sich die Zahl der jungen Mitglieder verdoppelt.", ["Im Gegensatz", "Sechs Monate später", "Zum Beispiel", "Wenn nicht"]],
    readingOptions: [
      ["weil wenige Jugendliche kamen", "weil Bücher fehlten", "weil das Personal Urlaub hatte", "weil das Gebäude unsicher war"],
      ["Schülerinnen und Schüler", "Touristen", "Professoren", "Geschäftsleute"],
      ["längere Öffnungszeiten am Abend", "Schließung am Mittag", "nur sonntags", "kürzere Werktage"],
      ["Arbeitsplätze", "ein Schwimmbad", "nur ein Café", "ein Kino"],
      ["sie halbierte sich", "sie blieb gleich", "sie stieg wenig", "sie verdoppelte sich"],
      ["Jugendliche", "nur der Bürgermeister", "Verlage", "Trainer"],
      ["die Geschichte Kölns", "Regeln der Stille", "ein Angebot im Wandel", "Gefahren digitaler Technik"],
    ],
  },
  french: {
    transport: ["à vélo", "en métro", "à pied", "en voiture", "en bus", "en train"],
    headings: ["Un lieu calme du passé", "Pourquoi les bibliothèques sont inutiles", "Une bibliothèque transformée par les jeunes", "Les règles de prêt"],
    gap: ["Les élèves ont proposé plusieurs changements. ___, le nombre de jeunes abonnés avait doublé.", ["Au contraire", "Six mois plus tard", "Par exemple", "À moins que"]],
    readingOptions: [
      ["parce que peu d'adolescents venaient", "parce qu'il manquait des livres", "parce que le personnel était en vacances", "parce que le bâtiment était dangereux"],
      ["les élèves", "les touristes", "les professeurs d'université", "les commerçants"],
      ["des horaires du soir", "la fermeture à midi", "seulement le dimanche", "des journées plus courtes"],
      ["des tables de travail", "une piscine", "seulement un café", "un cinéma"],
      ["il a diminué de moitié", "il n'a pas changé", "il a peu augmenté", "il a doublé"],
      ["les jeunes", "seulement le maire", "les éditeurs", "les entraîneurs"],
      ["l'histoire de Lyon", "les règles du silence", "un service transformé avec les jeunes", "les dangers du numérique"],
    ],
  },
  spanish: {
    transport: ["en bicicleta", "en metro", "a pie", "en coche", "en autobús", "en tren"],
    headings: ["Un lugar tranquilo del pasado", "Por qué las bibliotecas son innecesarias", "Una biblioteca transformada por jóvenes", "Reglas para prestar libros"],
    gap: ["Los alumnos propusieron varios cambios. ___, el número de socios jóvenes se había duplicado.", ["En cambio", "Seis meses después", "Por ejemplo", "A menos que"]],
    readingOptions: [
      ["porque iban pocos adolescentes", "porque faltaban libros", "porque el personal estaba de vacaciones", "porque el edificio era peligroso"],
      ["los estudiantes", "los turistas", "los profesores universitarios", "los comerciantes"],
      ["horario de tarde", "cerrar al mediodía", "abrir solo el domingo", "días más cortos"],
      ["mesas de estudio", "una piscina", "solo una cafetería", "un cine"],
      ["se redujo a la mitad", "no cambió", "creció un poco", "se duplicó"],
      ["los jóvenes", "solo el alcalde", "las editoriales", "los entrenadores"],
      ["la historia de Valencia", "reglas de silencio", "un servicio transformado con jóvenes", "los peligros de la tecnología"],
    ],
  },
};

function buildEuropean(slug, variant) {
  const pack = packs[slug];
  const ui = languageUi[slug];
  const tasks = [];
  tasks.push(auto(slug, variant, 1, "аудирование", "Прослушайте пять высказываний и установите соответствие между говорящими A–E и рубриками 1–6. Одна рубрика лишняя.", "12345", ["Каждый говорящий прямо называет свой способ передвижения.", "Ответ: 12345."], {
    options: ui.transport.map((item, index) => `${index + 1}) ${item}`),
    audioText: pack.matchAudio,
    format: "соответствие",
    maxScore: 2,
    resourceStatus: "До выпуска нужна запись носителем языка и аудиоплеер с экзаменационным режимом.",
  }));
  tasks.push(auto(slug, variant, 2, "аудирование", `Определите, какие утверждения соответствуют содержанию сообщения: 1 — True, 2 — False, 3 — Not stated.\n${pack.statements.map((item, index) => `${index + 1}) ${item}`).join("\n")}`, "1221123", ["1 — верно; 2 и 3 противоречат тексту; 4 и 5 верны; сад только планируется, поэтому 6 неверно; о продаже за рубеж ничего не сказано.", "Ответ: 1221123."], {
    audioText: pack.detailAudio,
    format: "True / False / Not stated",
    maxScore: 3,
    resourceStatus: "До выпуска нужна запись носителем языка.",
  }));
  const detailQuestions = [
    ["Когда начался проект?", ["в январе", "в марте", "в сентябре", "в декабре"], "2"],
    ["Сколько учеников участвовали?", ["85", "100", "120", "150"], "3"],
    ["Какова была первая проблема?", ["не было учителя", "не хватало контейнеров", "не было места", "не хватало участников"], "2"],
    ["Кто помог школе?", ["родители", "музей", "местная компания", "университет"], "3"],
    ["Сколько пластика собрали в первый месяц?", ["58 кг", "85 кг", "120 кг", "150 кг"], "2"],
    ["Что планируется дальше?", ["школьный сад", "поездка", "новый спортзал", "концерт"], "1"],
    ["Какова главная тема сообщения?", ["экологический проект", "экзамены", "транспорт", "питание"], "1"],
  ];
  detailQuestions.forEach(([question, options, answer], index) => {
    tasks.push(auto(slug, variant, index + 3, "аудирование", question, answer, [`Нужная деталь прямо названа в аудиотексте. Правильный вариант: ${answer}.`], {
      options,
      audioText: pack.detailAudio,
      format: "один номер",
      resourceStatus: "До выпуска нужна запись носителем языка.",
    }));
  });
  tasks.push(auto(slug, variant, 10, "чтение", "Установите соответствие между текстом о библиотеке и заголовком. Выберите наиболее точный заголовок.", "3", ["Текст описывает изменения библиотеки, сделанные по предложениям подростков."], {
    stimulus: pack.reading,
    options: ui.headings,
    format: "номер заголовка",
    maxScore: 3,
  }));
  tasks.push(auto(slug, variant, 11, "чтение", `Восстановите пропуск: «${ui.gap[0]}» Выберите связку.`, "2", ["Нужна временная связка, показывающая результат через шесть месяцев."], {
    options: ui.gap[1],
    stimulus: pack.reading,
    format: "номер фрагмента",
    maxScore: 2,
  }));
  const readingQuestions = [
    ["Почему библиотека раньше закрывалась рано?", "1"],
    ["Кого спросили о необходимых изменениях?", "1"],
    ["Какие часы работы предложили?", "1"],
    ["Какое оборудование появилось для учёбы?", "1"],
    ["Как изменилась численность молодых читателей?", "4"],
    ["Кто теперь участвует в планировании программы?", "1"],
    ["Какова основная идея текста?", "3"],
  ];
  readingQuestions.forEach(([question, answer], index) => {
    tasks.push(auto(slug, variant, index + 12, "чтение", question, answer, [`Ответ следует из соответствующего предложения текста. Правильный вариант: ${answer}.`], {
      stimulus: pack.reading,
      options: ui.readingOptions[index],
      format: "один номер",
    }));
  });
  pack.grammar.forEach(([sentence, answer], index) => {
    tasks.push(auto(slug, variant, index + 19, "грамматика", `Преобразуйте слово в скобках так, чтобы оно грамматически соответствовало контексту: ${sentence}`, answer, [`Форма выбирается по времени, согласованию и синтаксической роли. Ответ: ${answer}.`]));
  });
  pack.formation.forEach(([sentence, answer], index) => {
    tasks.push(auto(slug, variant, index + 25, "словообразование", `Образуйте однокоренное слово: ${sentence}`, answer, [`Нужна указанная контекстом часть речи. Ответ: ${answer}.`]));
  });
  pack.lexical.forEach(([sentence, options, answer], index) => {
    tasks.push(auto(slug, variant, index + 30, "лексика и грамматика", `${sentence} Выберите вариант 1–4.`, answer, [`Устойчивая сочетаемость и смысл контекста дают вариант ${answer}.`], {
      options,
      format: "один номер",
    }));
  });
  tasks.push(reviewed(slug, variant, 37, "электронное письмо", pack.email, ["Проверяются решение четырёх коммуникативных задач, организация текста, языковое оформление и объём 100–140 слов."], 6));
  tasks.push(reviewed(slug, variant, 38, "проектное высказывание", pack.report, ["Структура: вводная цель → 2–3 факта из таблицы → значимое сравнение → проблема и решение → мнение и вывод.", "Объём 200–250 слов."], 14, { stimulus: pack.report }));
  tasks.push(reviewed(slug, variant, 39, "чтение вслух", "Прочитайте текст вслух. Время на подготовку — 1,5 минуты.", ["Проверяются фонетическая корректность, фразовое ударение и интонация."], 1, {
    kind: "oral",
    format: "устный ответ",
    stimulus: pack.oral,
    resourceStatus: "Нужны запись эталона и запись ответа ученика.",
  }));
  tasks.push(reviewed(slug, variant, 40, "диалог-расспрос", "Вы рассматриваете объявление о летнем языковом лагере. Задайте четыре прямых вопроса: о месте, длительности смены, стоимости и ежедневных занятиях.", ["Нужно задать четыре грамматически правильных прямых вопроса, каждый — по отдельному пункту."], 4, {
    kind: "oral",
    format: "четыре вопроса",
    resourceStatus: "Нужно авторское изображение объявления и запись ответа ученика.",
  }));
  tasks.push(reviewed(slug, variant, 41, "интервью", "Ответьте развёрнуто на пять вопросов интервью о подготовке к экзаменам, роли учителя, онлайн-практике, отдыхе и планах после школы.", ["Каждый ответ должен быть полным, уместным и состоять более чем из одного слова."], 5, {
    kind: "oral",
    format: "пять устных ответов",
    audioText: "Пять вопросов интервью должны быть записаны носителем языка с экзаменационными паузами.",
    resourceStatus: "Нужен аудиофайл вопросов и запись ответа ученика.",
  }));
  tasks.push(reviewed(slug, variant, 42, "монолог по проекту", "Представьте две фотографии для проекта «Different ways of learning». Обоснуйте выбор, кратко опишите фотографии, назовите различия, преимущества и недостатки способов обучения и выразите мнение.", ["Монолог строится по пяти пунктам плана и содержит логические связки.", "Время ответа и объём контролируются в интерфейсе."], 10, {
    kind: "oral",
    format: "монолог",
    resourceStatus: "Нужны две авторские фотографии и запись ответа ученика.",
  }));
  return tasks;
}

const chineseMatchAudio = "说话人A：我每天骑自行车上学，又快又环保。说话人B：我喜欢在图书馆安静地看书。说话人C：周末我跟朋友踢足球。说话人D：我常用电脑学习汉语。说话人E：假期我想去北京旅行。说话人F：我每天帮父母做晚饭。";
const chineseListening = "学校从三月开始环保活动。一百二十名学生参加。开始的时候，学校没有足够的回收箱。后来一家本地公司送来了新回收箱。第一个月学生们收集了八十五公斤塑料。下学期他们想建一个小花园。";
const chineseReading = "李明家附近的图书馆以前很早关门，年轻读者不多。去年图书馆请中学生提出建议。学生们希望晚上也能学习，还想参加电脑课。六个月以后，年轻读者增加了一倍。现在学生也参加每月活动的设计。";
const chineseMiniTexts = "A 我每天骑自行车上学。B 放学后我喜欢在图书馆看书。C 周末我们班常常踢足球。D 我用手机练习汉语听力。E 暑假我想参观北京。F 我晚上和妈妈一起做饭。";
const chineseGrammar = [
  ["请选择正确的拼音：学校", ["xuéxiào", "xuěxiào", "xuéxǎo", "xǘexiào"], "1"],
  ["请选择量词：一___书", ["本", "张", "件", "条"], "1"],
  ["选择合适的词：我每天___汉语。", ["学习", "看见", "帮助", "结束"], "1"],
  ["选择正确的比较句：", ["我比他高。", "我他比高。", "比我他高。", "我高比他。"], "1"],
  ["选择正确的数词表达：", ["二百零五", "两百五零", "二零五百", "百二十五零"], "1"],
  ["昨天我___作业了。", ["做", "做了", "做着", "做过着"], "2"],
  ["他说汉语说___很好。", ["的", "得", "地", "了"], "2"],
  ["我没听清，请___说一次。", ["又", "再", "还", "才"], "2"],
  ["我终于写___了作业。", ["完", "到", "见", "住"], "1"],
  ["这本书太难，我看___懂。", ["不", "没", "别", "无"], "1"],
  ["老师走___教室来了。", ["进", "出", "回", "过"], "1"],
  ["选择正确的语序：", ["我昨天在图书馆看书。", "我在图书馆昨天看书。", "昨天看书我在图书馆。", "看书我昨天图书馆在。"], "1"],
  ["选择正确的关联词：___下雨，___我们还要去上课。", ["虽然…但是…", "因为…所以…", "如果…就…", "一边…一边…"], "1"],
];

function buildChinese(variant) {
  const tasks = [];
  tasks.push(auto("chinese", variant, 1, "аудирование", "Прослушайте шесть коротких высказываний A–F и соотнесите их с рубриками: 1) 上学交通; 2) 阅读; 3) 运动; 4) 网络学习; 5) 旅行; 6) 做饭; 7) 买东西. Одна рубрика лишняя.", "123456", ["Каждый говорящий называет одно действие; рубрика 7 не используется.", "Ответ: 123456."], {
    audioText: chineseMatchAudio,
    format: "соответствие",
    maxScore: 6,
    resourceStatus: "Нужна запись носителем китайского языка.",
  }));
  const listenQuestions = [
    ["活动什么时候开始？", ["一月", "三月", "九月", "十二月"], "2"],
    ["多少学生参加？", ["八十五", "一百", "一百二十", "两百"], "3"],
    ["开始有什么问题？", ["没有老师", "回收箱不够", "学生太少", "没有花园"], "2"],
    ["谁送来了回收箱？", ["家长", "公司", "大学", "医院"], "2"],
    ["第一个月收集了多少塑料？", ["五十八公斤", "八十五公斤", "一百公斤", "一百二十公斤"], "2"],
    ["下学期想做什么？", ["建花园", "开商店", "去旅行", "办比赛"], "1"],
    ["这段话的主题是什么？", ["考试", "环保活动", "交通", "健康"], "2"],
    ["活动在哪儿进行？", ["学校", "医院", "车站", "饭店"], "1"],
  ];
  listenQuestions.forEach(([prompt, options, answer], index) => {
    tasks.push(auto("chinese", variant, index + 2, "аудирование", prompt, answer, [`Ответ прямо назван в аудиотексте. Правильный вариант: ${answer}.`], {
      options,
      audioText: chineseListening,
      format: "один номер",
      resourceStatus: "Нужна запись носителем китайского языка.",
    }));
  });
  tasks.push(auto("chinese", variant, 10, "чтение", "Прочитайте шесть мини-текстов A–F и соотнесите их с рубриками: 1) 绿色交通; 2) 阅读习惯; 3) 体育活动; 4) 数字学习; 5) 旅游计划; 6) 家庭劳动; 7) 购物。Одна рубрика лишняя.", "123456", ["Ключевые слова 自行车, 图书馆, 足球, 手机学习, 北京 и 做饭 определяют рубрики 1–6.", "Ответ: 123456."], {
    stimulus: chineseMiniTexts,
    format: "соответствие",
    maxScore: 6,
  }));
  tasks.push(auto("chinese", variant, 11, "чтение", "Восстановите пропуски A–D в тексте: 图书馆以前很早关门，(A)___。后来学生提出建议，(B)___。图书馆接受了建议，(C)___。六个月以后，(D)___. Фрагменты: 1) 因为年轻读者不多; 2) 希望晚上也能学习; 3) 增加了晚上的开放时间; 4) 年轻读者增加了一倍; 5) 所以学生不喜欢运动.", "1234", ["Причина ставится в A, содержание предложения — в B, действие библиотеки — в C, результат — в D.", "Ответ: 1234."], {
    stimulus: chineseReading,
    format: "соответствие",
    maxScore: 4,
  }));
  const readQuestions = [
    ["图书馆以前为什么很早关门？", ["年轻读者不多", "没有书", "没有老师", "天气不好"], "1"],
    ["学生希望什么时候学习？", ["早上", "晚上", "中午", "周末"], "2"],
    ["六个月以后有什么变化？", ["图书馆关门了", "年轻读者增加了一倍", "电脑课取消了", "学生搬家了"], "2"],
  ];
  readQuestions.forEach(([prompt, options, answer], index) => {
    tasks.push(auto("chinese", variant, index + 12, "чтение", prompt, answer, [`Нужная информация есть в тексте. Правильный вариант: ${answer}.`], { options, stimulus: chineseReading, format: "один номер" }));
  });
  chineseGrammar.forEach(([prompt, options, answer], index) => {
    tasks.push(auto("chinese", variant, index + 15, "грамматика, лексика и иероглифика", prompt, answer, [`Контекст и грамматическая модель дают вариант ${answer}.`], { options, format: "один номер" }));
  });
  tasks.push(reviewed("chinese", variant, 28, "электронное письмо", "Вы получили письмо от китайского друга 王明. Ответьте на его три вопроса о школьных кружках и задайте три вопроса о его новом спортивном клубе. Соблюдайте требуемый объём.", ["Проверяются решение коммуникативной задачи, логика, лексика, грамматика и иероглифика."], 8));
  tasks.push(reviewed("chinese", variant, 29, "письменное высказывание", "Напишите высказывание «Моё мнение» по теме: 网络学习可以完全代替课堂学习吗？ Обоснуйте позицию и рассмотрите противоположную точку зрения.", ["Структура: постановка проблемы → собственное мнение и аргументы → противоположная позиция → контраргумент → вывод."], 12));
  tasks.push(reviewed("chinese", variant, 30, "диалог-расспрос", "По объявлению о языковом лагере задайте пять вопросов: место, даты, цена, занятия и проживание.", ["Каждый вопрос должен быть коммуникативно уместным и грамматически оформленным."], 5, { kind: "oral", format: "пять вопросов", resourceStatus: "Нужно авторское объявление и запись ответа." }));
  tasks.push(reviewed("chinese", variant, 31, "описание фотографии", "Выберите одну из трёх фотографий на тему школьной жизни и опишите её по плану.", ["Нужно раскрыть все пункты плана, связно описать ситуацию и объяснить выбор."], 7, { kind: "oral", format: "монолог", resourceStatus: "Нужны три авторские фотографии." }));
  tasks.push(reviewed("chinese", variant, 32, "проектный монолог", "Для проекта «学习汉语的方法» выберите две иллюстрации, сравните способы обучения, назовите преимущества и недостатки и обоснуйте свой выбор.", ["Монолог должен раскрыть все пункты плана и использовать средства логической связи."], 8, { kind: "oral", format: "монолог", resourceStatus: "Нужны две авторские иллюстрации и запись ответа." }));
  return tasks;
}

export function buildLanguageEgeVariant(subjectSlug, variantId = 1) {
  const variant = Math.min(12, Math.max(1, Number(variantId) || 1));
  if (subjectSlug === "chinese") return buildChinese(variant);
  if (!packs[subjectSlug]) throw new Error(`Unsupported language subject: ${subjectSlug}`);
  return buildEuropean(subjectSlug, variant);
}
