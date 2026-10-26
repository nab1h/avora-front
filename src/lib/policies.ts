type PolicyContent = {
  title: string;
  description: string;
  sections: { title: string; body: string }[];
};

export const policies: Record<string, { ar: PolicyContent; en: PolicyContent }> = {
  "privacy-policy": {
    ar: {
      title: "سياسة الخصوصية",
      description: "تعرّف على كيفية التعامل مع بياناتك عند تصفح الموقع والتواصل معنا وطلب منتجاتنا.",
      sections: [
        { title: "البيانات التي نتلقاها", body: "عند إنشاء حساب أو التواصل معنا، نتلقى البيانات التي تقدمها مثل الاسم والبريد الإلكتروني ورقم الهاتف وتفاصيل استفسارك أو طلبك. وقد تتم معالجة معلومات تقنية عن الزيارة، مثل نوع المتصفح والصفحات التي تزورها، بحسب الأدوات المفعّلة على الموقع." },
        { title: "استخدام البيانات", body: "نستخدم البيانات للرد على الاستفسارات، وإدارة الحسابات، ومتابعة الطلبات والتوصيل وخدمة ما بعد البيع، وتحسين تجربة الموقع وحمايته من إساءة الاستخدام. يرجى مشاركة المعلومات اللازمة فقط لإتمام طلبك." },
        { title: "مشاركة البيانات والخدمات الخارجية", body: "قد نشارك المعلومات اللازمة لتنفيذ طلبك مع مقدمي خدمات مثل الشحن والدعم التقني. وعند الانتقال إلى واتساب أو الخرائط أو تسجيل الدخول عبر خدمات خارجية، تخضع البيانات التي تقدمها هناك لسياسات تلك الخدمات. يمكنك مراجعة سياساتها قبل استخدامها." },
        { title: "ملفات تعريف الارتباط", body: "قد يستخدم الموقع ملفات تعريف الارتباط أو التخزين المحلي لتشغيل الحساب وحفظ تفضيلات اللغة والمظهر. وقد تعالج أدوات التحليلات المفعّلة بيانات الزيارة. يمكنك إدارة ملفات تعريف الارتباط من إعدادات المتصفح، وقد يؤثر تعطيل بعضها على وظائف الموقع." },
        { title: "الحفظ والأمان وطلبات الخصوصية", body: "نحتفظ بالبيانات بالقدر اللازم للأغراض المرتبطة بها وللمتطلبات النظامية المنطبقة. لا توجد وسيلة نقل أو تخزين إلكترونية تضمن الأمان المطلق. للاستفسار عن بياناتك أو طلب تصحيحها أو حذفها، تواصل معنا عبر وسائل الاتصال المنشورة؛ وتخضع الاستجابة لطبيعة الطلب والمتطلبات المنطبقة." },
        { title: "تحديث السياسة", body: "قد نحدّث هذه السياسة عند تغير الخدمات أو طريقة التعامل مع البيانات. تُنشر النسخة الحالية في هذه الصفحة، ويمكنك التواصل معنا للاستفسار عن أي بند." },
      ],
    },
    en: {
      title: "Privacy policy",
      description: "Learn how your information is handled when you browse, contact us, and request our products.",
      sections: [
        { title: "Information we receive", body: "When you create an account or contact us, we receive information you provide, such as your name, email address, phone number, and inquiry or order details. Technical visit information, such as browser type and pages visited, may also be processed depending on the tools enabled on the website." },
        { title: "How information is used", body: "We use information to answer inquiries, manage accounts, coordinate orders and delivery, provide after-sales support, and improve and protect the website. Please share only the information needed to handle your request." },
        { title: "Sharing and external services", body: "Information needed to fulfill your request may be shared with service providers such as delivery and technical support partners. When you use WhatsApp, maps, or external sign-in services, information you provide there is subject to those services’ policies. You can review their policies before using them." },
        { title: "Cookies and local storage", body: "The website may use cookies or local storage to operate accounts and remember language and appearance preferences. Enabled analytics tools may process visit information. You can manage cookies in your browser settings; disabling some may affect website functionality." },
        { title: "Retention, security, and privacy requests", body: "Information is retained as needed for its associated purposes and applicable requirements. No electronic transmission or storage method guarantees absolute security. Contact us through our published contact channels to ask about your information or request correction or deletion. Responses depend on the request and applicable requirements." },
        { title: "Policy updates", body: "We may update this policy as our services or data practices change. The current version is published on this page. Contact us if you have questions about any provision." },
      ],
    },
  },
  "terms-and-conditions": {
    ar: {
      title: "الشروط والأحكام",
      description: "إرشادات استخدام الموقع والاستفسار عن المنتجات وتأكيد الطلبات، لتجربة واضحة من البداية.",
      sections: [
        { title: "استخدام الموقع", body: "يرجى استخدام الموقع لأغراض مشروعة وتقديم معلومات صحيحة عند التسجيل أو الاستفسار. يُمنع تعطيل الخدمات أو محاولة الوصول غير المصرح به إلى الحسابات أو الأنظمة. أنت مسؤول عن الحفاظ على سرية بيانات حسابك وإبلاغنا عند الاشتباه في استخدامها دون إذنك." },
        { title: "معلومات المنتجات", body: "نسعى لعرض معلومات وصور دقيقة للمنتجات. قد تختلف الألوان الظاهرة بحسب الشاشة والإضاءة. قبل تأكيد الطلب، يرجى مراجعة المقاسات والألوان والقدرة والمواصفات الفنية ومدى ملاءمة المنتج لمشروعك مع فريقنا." },
        { title: "الأسعار وتأكيد الطلب", body: "إرسال استفسار عبر الموقع أو واتساب لا يُعد تأكيدًا للطلب. يتم تأكيد التوفر والكميات والسعر النهائي والعملة وأي ضرائب أو رسوم شحن وشروط الدفع والتسليم عند التواصل مع فريقنا، وقبل إتمام الدفع. أي تعديل على التفاصيل المؤكدة يحتاج إلى اتفاق جديد." },
        { title: "التوصيل والتركيب", body: "يتم الاتفاق على عنوان التسليم وتكاليفه والموعد المتوقع أثناء تأكيد الطلب. يرجى توفير بيانات تواصل وعنوان صحيحين وإبلاغنا بأي متطلبات خاصة. لا تشمل المنتجات خدمة التركيب إلا إذا نُص عليها في العرض، ويجب تنفيذ الأعمال الكهربائية بواسطة مختص مؤهل." },
        { title: "المحتوى والروابط الخارجية", body: "الشعارات والصور والنصوص المعروضة تخص أصحابها ولا يجوز إعادة استخدامها تجاريًا دون إذن. قد يتضمن الموقع روابط لخدمات خارجية؛ يرجى مراجعة شروطها وسياساتها عند استخدامها." },
        { title: "السياسات والاستفسارات", body: "توضح صفحات الخصوصية والدفع والاستبدال والاسترجاع التفاصيل المرتبطة بكل موضوع. لا تلغي هذه الشروط الحقوق المقررة بموجب الأنظمة المنطبقة. للاستفسار عن بند أو معالجة مشكلة في طلب، تواصل معنا مع ذكر التفاصيل ورقم الطلب إن وجد." },
      ],
    },
    en: {
      title: "Terms and conditions",
      description: "Guidelines for using our website, exploring products, and confirming orders with confidence.",
      sections: [
        { title: "Using the website", body: "Use the website for lawful purposes and provide accurate registration and inquiry information. Disrupting services or attempting unauthorized access to accounts or systems is prohibited. Keep your account credentials confidential and notify us of suspected unauthorized use." },
        { title: "Product information", body: "We aim to present accurate product information and images. Displayed colors may vary with screens and lighting. Before confirming an order, review dimensions, colors, power ratings, technical specifications, and suitability for your project with our team." },
        { title: "Prices and order confirmation", body: "An inquiry through the website or WhatsApp does not confirm an order. Availability, quantities, final price, currency, any taxes or delivery charges, payment terms, and delivery arrangements are confirmed with our team before payment. Changes to confirmed details require a new agreement." },
        { title: "Delivery and installation", body: "Delivery address, charges, and estimated timing are agreed during order confirmation. Provide accurate contact and address details and tell us about special requirements. Installation is included only when stated in the quotation. Electrical work should be performed by a qualified professional." },
        { title: "Content and external links", body: "Displayed logos, images, and text belong to their respective owners and may not be reused commercially without permission. The website may link to external services; review their terms and policies when using them." },
        { title: "Policies and questions", body: "Our privacy, payment, and exchange and returns pages explain their respective topics. These terms do not remove rights provided by applicable requirements. To clarify a provision or resolve an order issue, contact us with the details and your order reference, if available." },
      ],
    },
  },
  "returns-and-exchanges": {
    ar: {
      title: "الاستبدال والاسترجاع",
      description: "خطوات طلب الاستبدال أو الاسترجاع وما تحتاج إلى مراجعته قبل إعادة المنتج.",
      sections: [
        { title: "قبل تأكيد الشراء", body: "يرجى التأكد من مواصفات المنتج ومراجعة مدة وشروط الاستبدال والاسترجاع الخاصة بطلبك مع فريقنا قبل الدفع، خصوصًا للمنتجات التي تُجهز حسب الطلب. تُوضح التفاصيل في العرض أو تأكيد الطلب، مع مراعاة الحقوق المقررة بموجب الأنظمة المنطبقة." },
        { title: "تقديم طلب الاستبدال أو الاسترجاع", body: "تواصل معنا عبر صفحة التواصل أو بيانات الاتصال المنشورة، وأرسل رقم الطلب أو الفاتورة واسم المنتج وسبب الطلب وصورًا توضح حالته عند الحاجة. احتفظ بإثبات الشراء، وانتظر تعليمات فريقنا بشأن عنوان الإرجاع وطريقة الشحن قبل إرسال المنتج." },
        { title: "حالة المنتج والملحقات", body: "للطلبات المتعلقة بتغيير الرأي، يرجى الحفاظ على المنتج دون استخدام أو تركيب، مع عبوته وملحقاته، إلى حين مراجعة أهلية الطلب وفق الشروط المتفق عليها. قد تخضع المنتجات المخصصة أو المعدلة لشروط مختلفة تُوضح قبل الشراء؛ ولا يؤثر ذلك على معالجة العيوب أو عدم مطابقة الطلب." },
        { title: "منتج تالف أو غير مطابق", body: "افحص المنتجات عند الاستلام، وأبلغنا عند اكتشاف تلف أو نقص أو اختلاف عن الطلب. احتفظ بالعبوة والتقط صورًا للمنتج وملصق الشحن لتسهيل المراجعة. سيتابع فريقنا الحالة معك لتحديد الإجراء المناسب بعد التحقق من التفاصيل." },
        { title: "الشحن ورد المبلغ", body: "تُوضح مسؤولية تكاليف شحن الإرجاع وأي تكاليف متعلقة به عند مراجعة الطلب ووفق سببه والشروط المنطبقة. بعد قبول الاسترجاع وفحص المنتج عند الحاجة، يتم تأكيد قيمة المبلغ وطريقة رده والمدة المتوقعة. قد تختلف مدة ظهوره بحسب البنك أو جهة الدفع." },
      ],
    },
    en: {
      title: "Returns and exchanges",
      description: "How to request a return or exchange, and what to check before sending a product back.",
      sections: [
        { title: "Before confirming a purchase", body: "Check product specifications and confirm the return and exchange window and conditions for your order with our team before payment, especially for made-to-order products. Details are provided in the quotation or order confirmation, subject to rights under applicable requirements." },
        { title: "Submitting a request", body: "Contact us through our contact page or published contact details. Provide your order or invoice reference, product name, reason for the request, and photographs of its condition where needed. Keep proof of purchase and wait for return address and shipping instructions before sending the product." },
        { title: "Product condition and accessories", body: "For change-of-mind requests, keep the product unused and uninstalled with its packaging and accessories while eligibility is reviewed under the agreed conditions. Customized or modified products may have different conditions disclosed before purchase; this does not affect the handling of defects or products that do not match the order." },
        { title: "Damaged or incorrect products", body: "Inspect products on receipt and contact us when you discover damage, missing items, or a mismatch with your order. Keep the packaging and photograph the product and shipping label to assist review. Our team will follow up to determine the appropriate resolution after checking the details." },
        { title: "Return shipping and refunds", body: "Responsibility for return shipping and related costs is explained during review according to the reason and applicable conditions. Once a return is accepted and the product inspected where needed, the refund amount, method, and expected timing are confirmed. Posting times may vary by bank or payment provider." },
      ],
    },
  },
  "payment-policy": {
    ar: {
      title: "سياسة الدفع",
      description: "معلومات واضحة عن تأكيد قيمة الطلب وإجراءات الدفع ومتابعة المعاملة.",
      sections: [
        { title: "وسائل الدفع المتاحة", body: "يتم توضيح وسائل الدفع المتاحة لطلبك عبر قنوات التواصل الرسمية عند تأكيده. عرض المنتجات أو إرسال استفسار لا يعني تنفيذ عملية دفع، ولا يؤكد توفر وسيلة دفع محددة. يرجى التحقق من تفاصيل الدفع مع فريقنا قبل تحويل أي مبلغ." },
        { title: "المبلغ والعملة والرسوم", body: "قبل الدفع، راجع عرض السعر الذي يوضح المنتجات والكميات والعملة والإجمالي وأي ضرائب أو رسوم توصيل أو خدمات إضافية. إذا تطلب الطلب دفعة مقدمة أو دفعات على مراحل، تُحدد قيمها ومواعيدها وشروطها ضمن الاتفاق الخاص بالطلب." },
        { title: "تأكيد السداد", body: "استخدم بيانات الدفع التي يرسلها فريقنا عبر قنواته الرسمية فقط، وتأكد من مطابقة المبلغ ومرجع الطلب. قد يُطلب إثبات السداد لمطابقة المعاملة. يُؤكد استلام الدفع بعد التحقق منه، ثم تتم متابعة تجهيز الطلب وفق التفاصيل المتفق عليها." },
        { title: "أمان معلومات الدفع", body: "لا ترسل كلمات المرور أو رمز التحقق لمرة واحدة أو الرقم السري للبطاقة عبر الرسائل أو البريد. عند استخدام رابط دفع خارجي معتمد لطلبك، راجع اسم الجهة المستفيدة والمبلغ وأدخل البيانات الحساسة داخل واجهة جهة الدفع فقط. تواصل معنا إذا وصلك طلب دفع غير متوقع." },
        { title: "تعذر الدفع أو تكراره", body: "إذا تعذر الدفع أو لم يظهر تأكيده، تحقق من حالة العملية لدى البنك أو جهة الدفع قبل إعادة المحاولة. عند خصم مبلغ دون تأكيد أو تكرار الخصم، تواصل معنا بمرجع المعاملة دون إرسال بيانات البطاقة الحساسة ليتم التحقق من الحالة." },
        { title: "الإلغاء ورد المدفوعات", body: "لطلب إلغاء أو استرداد مبلغ، تواصل معنا مع رقم الطلب وإثبات السداد. تُراجع أهلية الطلب وفق حالة تجهيزه وشروطه وسياسة الاستبدال والاسترجاع. عند الموافقة، نوضح المبلغ المسترد وطريقة رده والمدة المتوقعة بحسب جهة الدفع." },
      ],
    },
    en: {
      title: "Payment policy",
      description: "Clear information about confirming your order total, making a payment, and tracking your transaction.",
      sections: [
        { title: "Available payment methods", body: "Payment methods available for your order are explained through our official contact channels when it is confirmed. Viewing products or submitting an inquiry does not process a payment or confirm that a particular payment method is available. Verify payment details with our team before transferring funds." },
        { title: "Amount, currency, and charges", body: "Before payment, review the quotation showing products, quantities, currency, total, and any taxes, delivery charges, or additional services. If a deposit or staged payments are required, their amounts, dates, and conditions are set out in the order agreement." },
        { title: "Payment confirmation", body: "Use only the payment details provided by our team through official channels and check the amount and order reference. Proof of payment may be requested to match the transaction. Receipt is confirmed after verification, and order preparation proceeds under the agreed arrangements." },
        { title: "Payment information security", body: "Do not send passwords, one-time verification codes, or card PINs by message or email. When using an external payment link approved for your order, check the recipient and amount, and enter sensitive information only in the payment provider’s interface. Contact us about unexpected payment requests." },
        { title: "Failed or duplicate payments", body: "If payment fails or confirmation is missing, check the transaction status with your bank or payment provider before trying again. For an unconfirmed debit or duplicate charge, contact us with the transaction reference, without sharing sensitive card information, so the issue can be checked." },
        { title: "Cancellations and refunds", body: "For a cancellation or refund request, contact us with your order reference and proof of payment. Eligibility is reviewed according to order preparation status, agreed conditions, and the returns and exchanges policy. If approved, we confirm the refund amount, method, and expected timing based on the payment provider." },
      ],
    },
  },
};

export function getPolicy(slug: string, locale: string) {
  return policies[slug][locale === "ar" ? "ar" : "en"];
}
