// Multi-language translations for ChatBot
export const translations = {
  en: {
    name: 'English',
    flag: '🇺🇸',
    assistant: 'Litera AI Assistant',
    online: 'Online',
    typePlaceholder: 'Type your message...',
    poweredBy: 'Powered by Litera AI',
    selectLanguage: 'Select Language',
    quickActions: 'Quick actions:',
    welcomeMessage: "Hello! I'm your Litera AI Assistant. How can I help you today?",
    quickActionButtons: [
      { label: '📚 Courses', message: 'Tell me about available courses' },
      { label: '💳 Subscription', message: 'What are the subscription plans?' },
      { label: '🎓 Certificates', message: 'How do I get a certificate?' },
      { label: '💰 Wallet', message: 'Tell me about the wallet and rewards' },
    ],
    responses: {
      courses: "We offer a wide range of courses including Full Stack Development, AI/ML, Data Science, and more! You can explore all our courses by visiting the Courses page. Would you like me to guide you to a specific course category?",
      subscription: "We offer flexible subscription plans to suit your learning needs. Visit our Subscription page from your dashboard to view all available plans and their benefits. Premium subscribers get access to live classes, recordings, and exclusive content!",
      certificate: "Yes! Upon successfully completing a course, you'll receive a certificate of completion. This certificate is recognized and can be shared on LinkedIn and other professional platforms.",
      login: "Having trouble logging in? You can reset your password from the login page. If you're still facing issues, please ensure you're using the correct email address. Need more help? Contact our support team.",
      payment: "For payment and billing inquiries, please visit the Billing section in your dashboard. We accept multiple payment methods including credit/debit cards and UPI. If you need assistance with a transaction, our support team is here to help!",
      liveClass: "Live classes are interactive sessions where you can learn directly from instructors and ask questions in real-time. Check the Live Classes section in your dashboard to view upcoming sessions and join them!",
      recording: "All live classes are recorded and available in the Recordings section of your dashboard. You can watch them anytime at your own pace. Premium subscribers have unlimited access to all recordings!",
      internship: "We offer exciting internship opportunities! Visit the Internships section in your dashboard to explore available positions. These internships provide real-world experience and can boost your career prospects.",
      wallet: "Your Litera Wallet lets you earn and spend coins! You can earn coins through course completions, referrals, and other activities. Use them to unlock premium content or get discounts. Check your Wallet in the dashboard for more details!",
      referral: "Earn rewards by referring friends! Visit the Refer & Earn section in your dashboard to get your unique referral link. You'll earn coins for every friend who joins using your link!",
      help: "I'm here to help! You can ask me about courses, subscriptions, payments, live classes, internships, and more. What specific information would you like to know?",
      progress: "You can track your learning progress from your Dashboard. It shows your enrolled courses, completion percentage, and achievements. Keep up the great work!",
      greeting: (name) => name ? `Hi ${name}! 👋 Welcome to Litera! How can I assist you with your learning journey today?` : 'Hello! 👋 Welcome to Litera! How can I assist you with your learning journey today?',
      thanks: "You're welcome! If you have any other questions, feel free to ask. Happy learning! 😊",
      goodbye: "Goodbye! Have a great day and happy learning! Feel free to reach out anytime you need assistance. 👋",
      default: "I'd be happy to help you with that! For detailed assistance, please visit the relevant section in your dashboard or contact our support team. Is there anything specific about courses, subscriptions, or platform features I can help you with?"
    }
  },
  es: {
    name: 'Español',
    flag: '🇪🇸',
    assistant: 'Asistente IA de Litera',
    online: 'En línea',
    typePlaceholder: 'Escribe tu mensaje...',
    poweredBy: 'Desarrollado por Litera AI',
    selectLanguage: 'Seleccionar idioma',
    quickActions: 'Acciones rápidas:',
    welcomeMessage: "¡Hola! Soy tu Asistente IA de Litera. ¿Cómo puedo ayudarte hoy?",
    quickActionButtons: [
      { label: '📚 Cursos', message: 'Cuéntame sobre los cursos disponibles' },
      { label: '💳 Suscripción', message: '¿Cuáles son los planes de suscripción?' },
      { label: '🎓 Certificados', message: '¿Cómo obtengo un certificado?' },
      { label: '💰 Billetera', message: 'Cuéntame sobre la billetera y recompensas' },
    ],
    responses: {
      courses: "¡Ofrecemos una amplia gama de cursos que incluyen Desarrollo Full Stack, IA/ML, Ciencia de Datos y más! Puedes explorar todos nuestros cursos visitando la página de Cursos. ¿Te gustaría que te guíe a una categoría específica?",
      subscription: "Ofrecemos planes de suscripción flexibles para adaptarnos a tus necesidades de aprendizaje. Visita nuestra página de Suscripción desde tu panel para ver todos los planes disponibles y sus beneficios. ¡Los suscriptores premium tienen acceso a clases en vivo, grabaciones y contenido exclusivo!",
      certificate: "¡Sí! Al completar exitosamente un curso, recibirás un certificado de finalización. Este certificado es reconocido y se puede compartir en LinkedIn y otras plataformas profesionales.",
      login: "¿Tienes problemas para iniciar sesión? Puedes restablecer tu contraseña desde la página de inicio de sesión. Si sigues teniendo problemas, asegúrate de usar la dirección de correo electrónico correcta. ¿Necesitas más ayuda? Contacta a nuestro equipo de soporte.",
      payment: "Para consultas sobre pagos y facturación, visita la sección de Facturación en tu panel. Aceptamos múltiples métodos de pago, incluidas tarjetas de crédito/débito y UPI. ¡Si necesitas ayuda con una transacción, nuestro equipo de soporte está aquí para ayudarte!",
      liveClass: "Las clases en vivo son sesiones interactivas donde puedes aprender directamente de los instructores y hacer preguntas en tiempo real. ¡Consulta la sección de Clases en Vivo en tu panel para ver las próximas sesiones y unirte a ellas!",
      recording: "Todas las clases en vivo se graban y están disponibles en la sección de Grabaciones de tu panel. Puedes verlas en cualquier momento a tu propio ritmo. ¡Los suscriptores premium tienen acceso ilimitado a todas las grabaciones!",
      internship: "¡Ofrecemos emocionantes oportunidades de pasantías! Visita la sección de Pasantías en tu panel para explorar las posiciones disponibles. Estas pasantías brindan experiencia del mundo real y pueden impulsar tus perspectivas profesionales.",
      wallet: "¡Tu Billetera Litera te permite ganar y gastar monedas! Puedes ganar monedas completando cursos, referencias y otras actividades. Úsalas para desbloquear contenido premium u obtener descuentos. ¡Consulta tu Billetera en el panel para más detalles!",
      referral: "¡Gana recompensas refiriendo amigos! Visita la sección Referir y Ganar en tu panel para obtener tu enlace de referencia único. ¡Ganarás monedas por cada amigo que se una usando tu enlace!",
      help: "¡Estoy aquí para ayudarte! Puedes preguntarme sobre cursos, suscripciones, pagos, clases en vivo, pasantías y más. ¿Qué información específica te gustaría saber?",
      progress: "Puedes rastrear tu progreso de aprendizaje desde tu Panel. Muestra tus cursos inscritos, porcentaje de finalización y logros. ¡Sigue con el gran trabajo!",
      greeting: (name) => name ? `¡Hola ${name}! 👋 ¡Bienvenido a Litera! ¿Cómo puedo ayudarte con tu viaje de aprendizaje hoy?` : '¡Hola! 👋 ¡Bienvenido a Litera! ¿Cómo puedo ayudarte con tu viaje de aprendizaje hoy?',
      thanks: "¡De nada! Si tienes alguna otra pregunta, no dudes en preguntar. ¡Feliz aprendizaje! 😊",
      goodbye: "¡Adiós! ¡Que tengas un gran día y feliz aprendizaje! No dudes en comunicarte cuando necesites ayuda. 👋",
      default: "¡Estaré encantado de ayudarte con eso! Para obtener asistencia detallada, visita la sección relevante en tu panel o contacta a nuestro equipo de soporte. ¿Hay algo específico sobre cursos, suscripciones o características de la plataforma con lo que pueda ayudarte?"
    }
  },
  fr: {
    name: 'Français',
    flag: '🇫🇷',
    assistant: 'Assistant IA Litera',
    online: 'En ligne',
    typePlaceholder: 'Tapez votre message...',
    poweredBy: 'Propulsé par Litera AI',
    selectLanguage: 'Sélectionner la langue',
    quickActions: 'Actions rapides:',
    welcomeMessage: "Bonjour! Je suis votre Assistant IA Litera. Comment puis-je vous aider aujourd'hui?",
    quickActionButtons: [
      { label: '📚 Cours', message: 'Parlez-moi des cours disponibles' },
      { label: '💳 Abonnement', message: 'Quels sont les plans d\'abonnement?' },
      { label: '🎓 Certificats', message: 'Comment obtenir un certificat?' },
      { label: '💰 Portefeuille', message: 'Parlez-moi du portefeuille et des récompenses' },
    ],
    responses: {
      courses: "Nous proposons une large gamme de cours, notamment le Développement Full Stack, l'IA/ML, la Science des Données, et plus encore! Vous pouvez explorer tous nos cours en visitant la page Cours. Souhaitez-vous que je vous guide vers une catégorie spécifique?",
      subscription: "Nous proposons des plans d'abonnement flexibles pour répondre à vos besoins d'apprentissage. Visitez notre page Abonnement depuis votre tableau de bord pour voir tous les plans disponibles et leurs avantages. Les abonnés premium ont accès aux cours en direct, aux enregistrements et au contenu exclusif!",
      certificate: "Oui! En complétant avec succès un cours, vous recevrez un certificat d'achèvement. Ce certificat est reconnu et peut être partagé sur LinkedIn et d'autres plateformes professionnelles.",
      login: "Des problèmes de connexion? Vous pouvez réinitialiser votre mot de passe depuis la page de connexion. Si vous rencontrez toujours des problèmes, assurez-vous d'utiliser la bonne adresse e-mail. Besoin de plus d'aide? Contactez notre équipe de support.",
      payment: "Pour les questions de paiement et de facturation, veuillez visiter la section Facturation dans votre tableau de bord. Nous acceptons plusieurs méthodes de paiement, y compris les cartes de crédit/débit et UPI. Si vous avez besoin d'aide pour une transaction, notre équipe de support est là pour vous aider!",
      liveClass: "Les cours en direct sont des sessions interactives où vous pouvez apprendre directement des instructeurs et poser des questions en temps réel. Consultez la section Cours en Direct dans votre tableau de bord pour voir les sessions à venir et les rejoindre!",
      recording: "Tous les cours en direct sont enregistrés et disponibles dans la section Enregistrements de votre tableau de bord. Vous pouvez les regarder à tout moment à votre rythme. Les abonnés premium ont un accès illimité à tous les enregistrements!",
      internship: "Nous offrons des opportunités de stage passionnantes! Visitez la section Stages dans votre tableau de bord pour explorer les postes disponibles. Ces stages offrent une expérience du monde réel et peuvent améliorer vos perspectives de carrière.",
      wallet: "Votre Portefeuille Litera vous permet de gagner et de dépenser des pièces! Vous pouvez gagner des pièces grâce à l'achèvement de cours, aux parrainages et à d'autres activités. Utilisez-les pour débloquer du contenu premium ou obtenir des réductions. Consultez votre Portefeuille dans le tableau de bord pour plus de détails!",
      referral: "Gagnez des récompenses en parrainant des amis! Visitez la section Parrainer et Gagner dans votre tableau de bord pour obtenir votre lien de parrainage unique. Vous gagnerez des pièces pour chaque ami qui rejoint en utilisant votre lien!",
      help: "Je suis là pour vous aider! Vous pouvez me poser des questions sur les cours, les abonnements, les paiements, les cours en direct, les stages, et plus encore. Quelles informations spécifiques aimeriez-vous connaître?",
      progress: "Vous pouvez suivre votre progression d'apprentissage depuis votre Tableau de bord. Il affiche vos cours inscrits, le pourcentage d'achèvement et les réalisations. Continuez votre excellent travail!",
      greeting: (name) => name ? `Bonjour ${name}! 👋 Bienvenue chez Litera! Comment puis-je vous aider dans votre parcours d'apprentissage aujourd'hui?` : 'Bonjour! 👋 Bienvenue chez Litera! Comment puis-je vous aider dans votre parcours d\'apprentissage aujourd\'hui?',
      thanks: "De rien! Si vous avez d'autres questions, n'hésitez pas à demander. Bon apprentissage! 😊",
      goodbye: "Au revoir! Passez une excellente journée et bon apprentissage! N'hésitez pas à nous contacter quand vous avez besoin d'aide. 👋",
      default: "Je serais ravi de vous aider avec cela! Pour une assistance détaillée, veuillez visiter la section pertinente dans votre tableau de bord ou contacter notre équipe de support. Y a-t-il quelque chose de spécifique concernant les cours, les abonnements ou les fonctionnalités de la plateforme avec lesquels je peux vous aider?"
    }
  },
  de: {
    name: 'Deutsch',
    flag: '🇩🇪',
    assistant: 'Litera KI-Assistent',
    online: 'Online',
    typePlaceholder: 'Nachricht eingeben...',
    poweredBy: 'Betrieben von Litera AI',
    selectLanguage: 'Sprache auswählen',
    quickActions: 'Schnellaktionen:',
    welcomeMessage: "Hallo! Ich bin Ihr Litera KI-Assistent. Wie kann ich Ihnen heute helfen?",
    quickActionButtons: [
      { label: '📚 Kurse', message: 'Erzählen Sie mir über verfügbare Kurse' },
      { label: '💳 Abonnement', message: 'Was sind die Abonnementpläne?' },
      { label: '🎓 Zertifikate', message: 'Wie erhalte ich ein Zertifikat?' },
      { label: '💰 Geldbörse', message: 'Erzählen Sie mir über Geldbörse und Belohnungen' },
    ],
    responses: {
      courses: "Wir bieten eine breite Palette von Kursen an, darunter Full Stack-Entwicklung, KI/ML, Datenwissenschaft und mehr! Sie können alle unsere Kurse auf der Kursseite erkunden. Möchten Sie, dass ich Sie zu einer bestimmten Kurskategorie führe?",
      subscription: "Wir bieten flexible Abonnementpläne, um Ihren Lernbedürfnissen gerecht zu werden. Besuchen Sie unsere Abonnementseite von Ihrem Dashboard aus, um alle verfügbaren Pläne und ihre Vorteile zu sehen. Premium-Abonnenten erhalten Zugang zu Live-Kursen, Aufzeichnungen und exklusiven Inhalten!",
      certificate: "Ja! Nach erfolgreichem Abschluss eines Kurses erhalten Sie ein Abschlusszertifikat. Dieses Zertifikat ist anerkannt und kann auf LinkedIn und anderen professionellen Plattformen geteilt werden.",
      login: "Probleme beim Anmelden? Sie können Ihr Passwort von der Anmeldeseite aus zurücksetzen. Wenn Sie weiterhin Probleme haben, stellen Sie sicher, dass Sie die richtige E-Mail-Adresse verwenden. Brauchen Sie mehr Hilfe? Kontaktieren Sie unser Support-Team.",
      payment: "Für Zahlungs- und Rechnungsanfragen besuchen Sie bitte den Abrechnungsbereich in Ihrem Dashboard. Wir akzeptieren mehrere Zahlungsmethoden, einschließlich Kredit-/Debitkarten und UPI. Wenn Sie Hilfe bei einer Transaktion benötigen, ist unser Support-Team für Sie da!",
      liveClass: "Live-Kurse sind interaktive Sitzungen, in denen Sie direkt von Dozenten lernen und in Echtzeit Fragen stellen können. Überprüfen Sie den Bereich Live-Kurse in Ihrem Dashboard, um bevorstehende Sitzungen anzuzeigen und ihnen beizutreten!",
      recording: "Alle Live-Kurse werden aufgezeichnet und sind im Aufzeichnungsbereich Ihres Dashboards verfügbar. Sie können sie jederzeit in Ihrem eigenen Tempo ansehen. Premium-Abonnenten haben unbegrenzten Zugriff auf alle Aufzeichnungen!",
      internship: "Wir bieten spannende Praktikumsmöglichkeiten! Besuchen Sie den Praktikumsbereich in Ihrem Dashboard, um verfügbare Positionen zu erkunden. Diese Praktika bieten praktische Erfahrung und können Ihre Karrierechancen verbessern.",
      wallet: "Ihre Litera-Geldbörse ermöglicht es Ihnen, Münzen zu verdienen und auszugeben! Sie können Münzen durch Kursabschlüsse, Empfehlungen und andere Aktivitäten verdienen. Verwenden Sie sie, um Premium-Inhalte freizuschalten oder Rabatte zu erhalten. Überprüfen Sie Ihre Geldbörse im Dashboard für weitere Details!",
      referral: "Verdienen Sie Belohnungen durch Empfehlungen von Freunden! Besuchen Sie den Bereich Empfehlen & Verdienen in Ihrem Dashboard, um Ihren einzigartigen Empfehlungslink zu erhalten. Sie verdienen Münzen für jeden Freund, der über Ihren Link beitritt!",
      help: "Ich bin hier, um zu helfen! Sie können mich nach Kursen, Abonnements, Zahlungen, Live-Kursen, Praktika und mehr fragen. Welche spezifischen Informationen möchten Sie wissen?",
      progress: "Sie können Ihren Lernfortschritt von Ihrem Dashboard aus verfolgen. Es zeigt Ihre eingeschriebenen Kurse, den Abschlussprozentsatz und die Erfolge. Machen Sie weiter so!",
      greeting: (name) => name ? `Hallo ${name}! 👋 Willkommen bei Litera! Wie kann ich Sie heute auf Ihrer Lernreise unterstützen?` : 'Hallo! 👋 Willkommen bei Litera! Wie kann ich Sie heute auf Ihrer Lernreise unterstützen?',
      thanks: "Gern geschehen! Wenn Sie weitere Fragen haben, fragen Sie gerne. Viel Spaß beim Lernen! 😊",
      goodbye: "Auf Wiedersehen! Haben Sie einen schönen Tag und viel Spaß beim Lernen! Wenden Sie sich jederzeit an uns, wenn Sie Hilfe benötigen. 👋",
      default: "Ich würde Ihnen gerne dabei helfen! Für detaillierte Unterstützung besuchen Sie bitte den entsprechenden Bereich in Ihrem Dashboard oder kontaktieren Sie unser Support-Team. Gibt es etwas Spezifisches zu Kursen, Abonnements oder Plattformfunktionen, bei dem ich Ihnen helfen kann?"
    }
  },
  hi: {
    name: 'हिंदी',
    flag: '🇮🇳',
    assistant: 'लिटेरा एआई सहायक',
    online: 'ऑनलाइन',
    typePlaceholder: 'अपना संदेश टाइप करें...',
    poweredBy: 'लिटेरा एआई द्वारा संचालित',
    selectLanguage: 'भाषा चुनें',
    quickActions: 'त्वरित क्रियाएं:',
    welcomeMessage: "नमस्ते! मैं आपका लिटेरा एआई सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?",
    quickActionButtons: [
      { label: '📚 पाठ्यक्रम', message: 'उपलब्ध पाठ्यक्रमों के बारे में बताएं' },
      { label: '💳 सदस्यता', message: 'सदस्यता योजनाएं क्या हैं?' },
      { label: '🎓 प्रमाणपत्र', message: 'मुझे प्रमाणपत्र कैसे मिलेगा?' },
      { label: '💰 वॉलेट', message: 'वॉलेट और पुरस्कारों के बारे में बताएं' },
    ],
    responses: {
      courses: "हम फुल स्टैक डेवलपमेंट, एआई/एमएल, डेटा साइंस और अधिक सहित पाठ्यक्रमों की एक विस्तृत श्रृंखला प्रदान करते हैं! आप पाठ्यक्रम पृष्ठ पर जाकर हमारे सभी पाठ्यक्रमों का अन्वेषण कर सकते हैं। क्या आप चाहेंगे कि मैं आपको किसी विशिष्ट पाठ्यक्रम श्रेणी की ओर मार्गदर्शन करूं?",
      subscription: "हम आपकी सीखने की जरूरतों के अनुरूप लचीली सदस्यता योजनाएं प्रदान करते हैं। सभी उपलब्ध योजनाओं और उनके लाभों को देखने के लिए अपने डैशबोर्ड से हमारे सदस्यता पृष्ठ पर जाएं। प्रीमियम सदस्यों को लाइव कक्षाओं, रिकॉर्डिंग और विशेष सामग्री तक पहुंच मिलती है!",
      certificate: "हां! किसी पाठ्यक्रम को सफलतापूर्वक पूरा करने पर, आपको पूर्णता का प्रमाणपत्र प्राप्त होगा। यह प्रमाणपत्र मान्यता प्राप्त है और इसे LinkedIn और अन्य पेशेवर प्लेटफॉर्म पर साझा किया जा सकता है।",
      login: "लॉग इन करने में परेशानी? आप लॉगिन पृष्ठ से अपना पासवर्ड रीसेट कर सकते हैं। यदि आप अभी भी समस्याओं का सामना कर रहे हैं, तो सुनिश्चित करें कि आप सही ईमेल पता उपयोग कर रहे हैं। अधिक सहायता चाहिए? हमारी सहायता टीम से संपर्क करें।",
      payment: "भुगतान और बिलिंग पूछताछ के लिए, कृपया अपने डैशबोर्ड में बिलिंग अनुभाग पर जाएं। हम क्रेडिट/डेबिट कार्ड और UPI सहित कई भुगतान विधियां स्वीकार करते हैं। यदि आपको किसी लेनदेन में सहायता की आवश्यकता है, तो हमारी सहायता टीम यहां मदद के लिए है!",
      liveClass: "लाइव कक्षाएं इंटरैक्टिव सत्र हैं जहां आप सीधे प्रशिक्षकों से सीख सकते हैं और वास्तविक समय में प्रश्न पूछ सकते हैं। आगामी सत्रों को देखने और उनमें शामिल होने के लिए अपने डैशबोर्ड में लाइव कक्षाएं अनुभाग देखें!",
      recording: "सभी लाइव कक्षाएं रिकॉर्ड की जाती हैं और आपके डैशबोर्ड के रिकॉर्डिंग अनुभाग में उपलब्ध हैं। आप उन्हें अपनी गति से कभी भी देख सकते हैं। प्रीमियम सदस्यों को सभी रिकॉर्डिंग तक असीमित पहुंच है!",
      internship: "हम रोमांचक इंटर्नशिप अवसर प्रदान करते हैं! उपलब्ध पदों का पता लगाने के लिए अपने डैशबोर्ड में इंटर्नशिप अनुभाग पर जाएं। ये इंटर्नशिप वास्तविक दुनिया का अनुभव प्रदान करती हैं और आपकी करियर संभावनाओं को बढ़ा सकती हैं।",
      wallet: "आपका लिटेरा वॉलेट आपको सिक्के कमाने और खर्च करने देता है! आप पाठ्यक्रम पूर्णता, रेफरल और अन्य गतिविधियों के माध्यम से सिक्के कमा सकते हैं। उनका उपयोग प्रीमियम सामग्री अनलॉक करने या छूट पाने के लिए करें। अधिक विवरण के लिए डैशबोर्ड में अपना वॉलेट देखें!",
      referral: "दोस्तों को रेफर करके पुरस्कार कमाएं! अपना अनूठा रेफरल लिंक प्राप्त करने के लिए अपने डैशबोर्ड में रेफर करें और कमाएं अनुभाग पर जाएं। आप प्रत्येक मित्र के लिए सिक्के कमाएंगे जो आपके लिंक का उपयोग करके शामिल होता है!",
      help: "मैं मदद के लिए यहां हूं! आप मुझसे पाठ्यक्रमों, सदस्यता, भुगतान, लाइव कक्षाओं, इंटर्नशिप और अधिक के बारे में पूछ सकते हैं। आप कौन सी विशिष्ट जानकारी जानना चाहेंगे?",
      progress: "आप अपने डैशबोर्ड से अपनी सीखने की प्रगति को ट्रैक कर सकते हैं। यह आपके नामांकित पाठ्यक्रमों, पूर्णता प्रतिशत और उपलब्धियों को दिखाता है। महान काम जारी रखें!",
      greeting: (name) => name ? `नमस्ते ${name}! 👋 लिटेरा में आपका स्वागत है! आज मैं आपकी सीखने की यात्रा में कैसे सहायता कर सकता हूं?` : 'नमस्ते! 👋 लिटेरा में आपका स्वागत है! आज मैं आपकी सीखने की यात्रा में कैसे सहायता कर सकता हूं?',
      thanks: "आपका स्वागत है! यदि आपके कोई अन्य प्रश्न हैं, तो बेझिझक पूछें। सुखद सीखना! 😊",
      goodbye: "अलविदा! एक महान दिन हो और सुखद सीखना! जब भी आपको सहायता की आवश्यकता हो, बेझिझक संपर्क करें। 👋",
      default: "मुझे उसमें आपकी मदद करके खुशी होगी! विस्तृत सहायता के लिए, कृपया अपने डैशबोर्ड में संबंधित अनुभाग पर जाएं या हमारी सहायता टीम से संपर्क करें। क्या पाठ्यक्रमों, सदस्यता या प्लेटफ़ॉर्म सुविधाओं के बारे में कुछ विशिष्ट है जिसमें मैं आपकी मदद कर सकता हूं?"
    }
  },
  zh: {
    name: '中文',
    flag: '🇨🇳',
    assistant: 'Litera AI助手',
    online: '在线',
    typePlaceholder: '输入您的消息...',
    poweredBy: '由Litera AI提供支持',
    selectLanguage: '选择语言',
    quickActions: '快速操作：',
    welcomeMessage: "您好！我是您的Litera AI助手。今天我能帮您什么吗？",
    quickActionButtons: [
      { label: '📚 课程', message: '告诉我有哪些课程' },
      { label: '💳 订阅', message: '订阅计划是什么？' },
      { label: '🎓 证书', message: '如何获得证书？' },
      { label: '💰 钱包', message: '告诉我关于钱包和奖励' },
    ],
    responses: {
      courses: "我们提供广泛的课程，包括全栈开发、AI/ML、数据科学等等！您可以通过访问课程页面探索我们所有的课程。您想让我引导您到特定的课程类别吗？",
      subscription: "我们提供灵活的订阅计划以满足您的学习需求。从您的仪表板访问我们的订阅页面查看所有可用计划及其好处。高级订阅者可以访问直播课程、录像和独家内容！",
      certificate: "是的！成功完成课程后，您将获得完成证书。该证书得到认可，可以在LinkedIn和其他专业平台上分享。",
      login: "登录有困难？您可以从登录页面重置密码。如果您仍然遇到问题，请确保使用正确的电子邮件地址。需要更多帮助？联系我们的支持团队。",
      payment: "有关付款和账单查询，请访问您仪表板中的账单部分。我们接受多种付款方式，包括信用卡/借记卡和UPI。如果您需要交易帮助，我们的支持团队随时为您提供帮助！",
      liveClass: "直播课程是互动会话，您可以直接从讲师那里学习并实时提问。查看您仪表板中的直播课程部分，查看即将举行的会话并加入！",
      recording: "所有直播课程都被录制并在您仪表板的录像部分提供。您可以随时按自己的节奏观看。高级订阅者可以无限访问所有录像！",
      internship: "我们提供令人兴奋的实习机会！访问您仪表板中的实习部分探索可用职位。这些实习提供真实世界的经验，可以提升您的职业前景。",
      wallet: "您的Litera钱包让您可以赚取和花费硬币！您可以通过完成课程、推荐和其他活动赚取硬币。使用它们解锁高级内容或获得折扣。查看仪表板中的钱包了解更多详情！",
      referral: "通过推荐朋友赚取奖励！访问您仪表板中的推荐和赚取部分获取您的独特推荐链接。您使用您的链接加入的每个朋友都会获得硬币！",
      help: "我在这里帮助您！您可以问我关于课程、订阅、付款、直播课程、实习等的问题。您想了解什么具体信息？",
      progress: "您可以从您的仪表板跟踪您的学习进度。它显示您注册的课程、完成百分比和成就。继续保持出色的工作！",
      greeting: (name) => name ? `你好 ${name}！👋 欢迎来到Litera！今天我如何帮助您的学习之旅？` : '你好！👋 欢迎来到Litera！今天我如何帮助您的学习之旅？',
      thanks: "不客气！如果您有任何其他问题，请随时提问。祝学习愉快！😊",
      goodbye: "再见！祝您有美好的一天，学习愉快！随时需要帮助时请联系我们。👋",
      default: "我很乐意帮助您！有关详细帮助，请访问您仪表板中的相关部分或联系我们的支持团队。关于课程、订阅或平台功能有什么具体的事情我可以帮助您吗？"
    }
  }
};

export const getTranslation = (lang) => {
  return translations[lang] || translations.en;
};

export const getSupportedLanguages = () => {
  return Object.keys(translations).map(key => ({
    code: key,
    name: translations[key].name,
    flag: translations[key].flag
  }));
};

