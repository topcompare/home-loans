var lang = document.documentElement.lang;

/*
SECTION: Set variables and base values
*/
var locales = {
  fr: {
    title: "Votre plan financier",
    brussels: "Bruxelles",
    flanders: "Flandre",
    wallonia: "Wallonie",
    registrationRights: "Droits d'enregistrement",
    mortgageFees: "Frais liés au crédit hypothécaire",
    notaryFees: "Frais de notaire liés à l'acte d'achat",
    totalCost: "Coût total du projet",
    ownFunds: "- Fonds propres",
    loanAmount: "Montant à emprunter",
    highlightEmploymentStatus:
      " Ce statut professionnel a des conditions spéciales pour les taux. Nous afficherons les taux standards mais le courtier sera informé de votre statut afin de vous proposer le meilleur taux.",
    highlightLTV:
      " Vous ne disposez pas de suffisamment de fonds propres pour financer votre projet. Peu de banques accordent un prêt hypothécaire avec une quotité  supérieure à 100%.",
    disclaimerTopHC:
      "Vos données seront envoyées à et traitées par HypoConnect SA, courtier en crédit hypothécaire, pour fournir un TAEG plus précis et une éligibilité préliminaire testée auprès des 15+ banques partenaires de HypoConnect. En soumettant votre recherche, vous donnez implicitement votre accord pour l’utilisation de vos données à ces fins. Après avoir soumis vos informations, vous aurez accès en temps réel aux taux personnalisés et votre éligibilité auprès de ces banques.",
    disclaimerBottomHC:
      "Cette page, qui est sous la responsabilité de HypoConnect NV, est hébergée par TopCompare Information Services Belgium.",
    disclaimerResultsHC:
      "Cet aperçu des produits est hébergé par TopCompare Information Services Belgium BVBA. HypoConnect NV propose des produits de banques disponibles via courtier (couleur mauve), indiquant votre probabilité d'éligibilité et un TAEG adapté selon vos informations personnelles et financières. Toute indication du TAEG ou de la probabilité d'éligibilité n'est pas contraignante, les conditions finales de la souscription au crédit hypothécaire sont la responsabilité ultime de la banque. TopCompare Information Services Belgium BVBA propose des produits de banques disponibles sans courtier, en utilisant uniquement les informations relatives à votre projet hypothécaire. Le calcul du TAEG présenté dans le tableau de résultats se fonde sur les hypothèses et montants suivants:<br>- le montant total des intérêts qui sont payés ;<br>- les frais de dossier entre 0 et 500 EUR en fonction de la banque ;<br>- les frais d’expertise d'une valeur moyenne de 250 EUR pour faire estimer la valeur de votre habitation par un expert ;<br>- les frais de notaire (autres que les honoraires) estimés pour l’établissement d’une inscription hypothécaire totale du montant de votre prêt ;<br>- la prime unique d’assurance solde restant dû,calculée sur base du taux sur le marché pour une personne non fumeur de 30 ans;<br>- le total des primes d’assurance habitation en tant que propriétaire, la prime annuelle moyenne du marché étant estimée à 320 EUR pour une habitation standard.",
    bannerLabel: "HypoConnect"
  },
  nl: {
    title: "Uw financieel plan",
    brussels: "Brussel",
    flanders: "Vlaanderen",
    wallonia: "Wallonië",
    registrationRights: "Registratierechten",
    mortgageFees: "Hypotheekkosten",
    notaryFees: "Notariskosten voor de aankoop",
    totalCost: "Totale kosten van het project",
    ownFunds: "- Persoonlijke bijdrage",
    loanAmount: "Totaal lening",
    highlightEmploymentStatus:
      " Deze professionele status heeft speciale voorwaarden voor tarieven. Wij geven de standaardtarieven weer, maar de makelaar wordt op de hoogte gebracht van uw status om u het beste tarief aan te bieden.",
    highlightLTV:
      " U beschikt niet over voldoende eigen vermogen om uw project te financieren. Weinig banken verstrekken een hypothecair krediet met een quotiteit hoger dan 100%. Wij geven de standaardtarieven weer, maar de makelaar wordt op de hoogte gebracht van uw situatie om u het beste tarief aan te bieden.",
    disclaimerTopHC:
      "Uw gegevens worden verzonden naar en verwerkt door HypoConnect hypotheekmakelaar om een nauwkeuriger JKP en voorlopige geschiktheid getest met de 15+ partner banken van HypoConnect. Door het indienen van uw simulatie gaat u impliciet akkoord met het gebruik van uw gegevens voor deze doeleinden. Na het invoeren van uw gegevens heeft u in realtime toegang tot gepersonaliseerde tarieven en uw geschiktheid bij deze banken",
    disclaimerBottomHC:
      "Deze webpagina, die onder de verantwoordelijkheid van HypoConnect NV valt, wordt gehost door TopCompare Information Services Belgium.",
    disclaimerResultsHC:
      "Dit productoverzicht wordt gehost door TopCompare Information Services Belgium BVBA. HypoConnect NV beschikt over producten van makelaarsbanken (paarse kleur) die uw waarschijnlijkheid van goedkeuring en een meer gepersonaliseerde JKP met behulp van uw persoonlijke en financiële informatie aangeven. Elke indicatie van een JKP of waarschijnlijkheid van goedkeuring is niet bindend, de uiteindelijke voorwaarden zijn de verantwoordelijkheid van de bank. TopCompare Information Services Belgium BVBA bevat producten van niet-makelaarsbanken en gebruikt alleen de informatie over uw hypotheekproject voor dit doel. Het jaarlijks kostenpercentage (JKP) vertegenwoordigt de kostprijs van de lening op jaarbasis en houdt rekening met de verschillende kosten verbonden aan een hypothecaire lening. De berekening van het JKP in de resultatentabel is gebaseerd op de volgende veronderstellingen en bedragen:<br>- het totale bedrag aan rente dat wordt betaald;<br>- de administratieve kosten tussen 0 en 500 EUR, afhankelijk van de bank;<br>- de kosten van een expertiseschatting met een gemiddelde waarde van 250 EUR om de waarde van uw woning door een expert te laten schatten;<br>- de geschatte notariskosten (andere dan honoraria) voor het vaststellen van een totale hypotheekregistratie van het bedrag van uw lening;<br>- de eenmalige premie voor de schuldsaldoverzekering, berekend op basis van het markttarief voor een niet-roker van 30 jaar;<br>- de totale woningverzekeringspremies als eigenaar, waarbij de gemiddelde jaarlijkse marktpremie wordt geschat op 320 euro voor een standaardwoning.",
    bannerLabel: "HypoConnect"
  }
};

var lang = "fr";
var regionalFees = { brussels: 0.125, wallonia: 0.125, flanders: 0.1 },
  region = "brussels";
var notaryFixedCost = 2178;
var VAT = 1.21;
var registrationFees = 0,
  notaryFeesMax = 0,
  mortgageFeesMax = 0,
  totalAmount,
  notaryVariablePercentage,
  notaryFixedFee,
  regionalDeduction = 0, 
  firstProperty = false,
  formScope, regionInfo, investmentInfo;
var ownFunds = 0,
  propertyValue = 0;

var notaryMatrix = [
  [0, 0.0456, 0],
  [7500, 0.0285, 128.25],
  [17500, 0.0228, 228],
  [30000, 0.0171, 399],
  [45495, 0.0114, 658.3215],
  [64095, 0.0057, 1023.663],
  [250095, 0.00057, 2306.65035]
];
var mortgageMatrix = [
  [-1902.44, 1.036259776191308, 1971.4220486173917],
  [5335.127425000001, 1.0318350094994342, 1995.0287427444325],
  [15026.599325, 1.0259937675598192, 2082.8027449314154],
  [22312.32525, 1.0259937675598192, 2107.693353732415],
  [27185.6492, 1.023097877144545, 2186.4200146837047],
  [42330.82772705, 1.0202182881494126, 2308.3154003613545],
  [46722.289394, 1.0202182881494126, 2333.0658960318615],
  [60537.96018105, 1.0173548633158815, 2506.411794585595],
  [71232.673858, 1.0173548633158815, 2531.092823569648],
  [95781.943608, 1.0173548633158815, 2555.773852553686],
  [120331.213358, 1.0173548633158815, 2580.454881537739],
  [144880.48310800001, 1.0173548633158815, 2605.135910521762],
  [169429.752858, 1.0173548633158815, 2629.816939505815],
  [193979.022608, 1.0173548633158815, 2654.497968489867],
  [218528.292358, 1.0173548633158815, 2679.1789974738904],
  [243077.562108, 1.0173548633158815, 2703.860026457943],
  [243170.94152105, 1.0150756703892165, 3258.093516343205],
  [267681.7981892, 1.0150756703892165, 3282.7192521068273],
  [292286.2439392, 1.0150756703892165, 3307.344987870479],
  [316890.6896892, 1.0150756703892165, 3331.970723634131],
  [341495.1354392, 1.0150756703892165, 3356.596459397783],
  [366099.5811892, 1.0150756703892165, 3381.2221951614347],
  [390704.0269392, 1.0150756703892165, 3405.8479309250274],
  [415308.4726892, 1.0150756703892165, 3430.4736666886793],
  [439912.9184392, 1.0150756703892165, 3455.09940245239],
  [464517.3641892, 1.0150756703892165, 3479.725138215983],
  [488636.6149392, 1.0160765253564337, 3507.8061306480854]
];

var notaryPercentageCol = 1;
var notaryFixedRateCol = 2;
var notaryFixedCost = 2178;

var mortgagePercentageCol = 1;
var mortgageFixedRateCol = 2;

function getStaircaseRow(matrix, value) {
  for (var i = 0; i < matrix.length; i++) {
    if (matrix[i][0] - value > 0) {
      return i - 1;
    } else if (value >= matrix[matrix.length - 1][0]) {
      return matrix.length - 1;
    }
  }
}

if (document.documentElement.lang == "nl-BE") {
  lang = "nl";
//  region = "flanders";
}

/*
SECTION: Create DOM structure
*/
// Prepare highlight boxes for exception cases
var highlightEmploymentStatus =
  '<div class="cgg-global-input--error-notification ng-binding ng-hide" ng-show="showErrorMessage" style="margin-top: -10px; margin-bottom: 10px" id="highlightEmploymentStatus"><span class="cgg-has-error-msg-icn m-cgg js-newsletter-submit-icon m-cgg-icon--warning"></span>' +
  locales[lang]["highlightEmploymentStatus"] +
  "</div>";
var highlightLTV =
  '<div class="cgg-global-input--error-notification ng-binding ng-hide" ng-show="showErrorMessage" style="margin-top: -10px; margin-bottom: 10px" id="highlightLTV"><span class="cgg-has-error-msg-icn m-cgg js-newsletter-submit-icon m-cgg-icon--warning"></span>' +
  locales[lang]["highlightLTV"] +
  "</div>";
var boxFP =
  '<div class="info_up_half"> <span class="info_up_half--title ng-binding">' +
  locales[lang]["title"] +
  '</span> </div><div class="info_down_half"><div class="cgg-row ng-scope"> <div class="cgg-col-md-12 ci-info-box__header ng-hide"> <span class="ci-info-box__header-text ng-binding"></span> <span class="m-cgg m-cgg-icon--chevron-right ci-info-box__header-edit-icon"></span> </div><span class="ng-scope"> <div class="cgg-col-md-6 cgg-col-lg-6 cgg-col-sm-6 cgg-col-xs-6 text-left text-bold text-ellipsis ng-binding" title="Droits d\'enregistrement">' +
  locales[lang]["registrationRights"] +
  '</div><div class="cgg-col-md-6 cgg-col-lg-6 cgg-col-sm-6 cgg-col-xs-6 info_link_style" id="fp-registration-fees"> <span class="m-cgg m-cgg-icon--chevron-right pl-icon-style"></span>&nbsp;</div></span> </div><div class="cgg-row ng-scope"> <div class="cgg-col-md-12 ci-info-box__header ng-hide"> <span class="ci-info-box__header-text ng-binding"></span> <span class="m-cgg m-cgg-icon--chevron-right ci-info-box__header-edit-icon"></span> </div><span class="ng-scope"> <div class="cgg-col-md-6 cgg-col-lg-6 cgg-col-sm-6 cgg-col-xs-6 text-left text-bold text-ellipsis ng-binding">' +
  locales[lang]["notaryFees"] +
  '</div><div class="cgg-col-md-6 cgg-col-lg-6 cgg-col-sm-6 cgg-col-xs-6 info_link_style" id="fp-notary-fees"> <span class="m-cgg m-cgg-icon--chevron-right pl-icon-style"></span>&nbsp;</div></span> </div><div class="cgg-row ng-scope"> <div class="cgg-col-md-12 ci-info-box__header ng-hide"> <span class="ci-info-box__header-text ng-binding"></span> <span class="m-cgg m-cgg-icon--chevron-right ci-info-box__header-edit-icon"></span> </div><span class="ng-scope"> <div class="cgg-col-md-6 cgg-col-lg-6 cgg-col-sm-6 cgg-col-xs-6 text-left text-bold text-ellipsis ng-binding">' +
  locales[lang]["mortgageFees"] +
  '</div><div class="cgg-col-md-6 cgg-col-lg-6 cgg-col-sm-6 cgg-col-xs-6 info_link_style" id="fp-mortgage-fees"> <span class="m-cgg m-cgg-icon--chevron-right pl-icon-style"></span>&nbsp;</div></span> </div><div class="cgg-row ng-scope"> <div class="cgg-col-md-12 ci-info-box__header ng-hide"> <span class="ci-info-box__header-text ng-binding"></span> <span class="m-cgg m-cgg-icon--chevron-right ci-info-box__header-edit-icon"></span> </div><span class="ng-scope"> <div class="cgg-col-md-6 cgg-col-lg-6 cgg-col-sm-6 cgg-col-xs-6 text-left text-bold text-ellipsis ng-binding">' +
  locales[lang]["totalCost"] +
  '</div><div class="cgg-col-md-6 cgg-col-lg-6 cgg-col-sm-6 cgg-col-xs-6 info_link_style" id="fp-total-cost"> <span class="m-cgg m-cgg-icon--chevron-right pl-icon-style"></span>&nbsp;</div></span></div><div class="cgg-row ng-scope" > <div class="cgg-col-md-12 ci-info-box__header ng-hide"> <span class="ci-info-box__header-text ng-binding"></span> <span class="m-cgg m-cgg-icon--chevron-right ci-info-box__header-edit-icon"></span> </div> <span class="ng-scope"> <div class="cgg-col-md-6 cgg-col-lg-6 cgg-col-sm-6 cgg-col-xs-6 text-left text-bold text-ellipsis ng-binding">' +
  locales[lang]["ownFunds"] +
  '</div><div class="cgg-col-md-6 cgg-col-lg-6 cgg-col-sm-6 cgg-col-xs-6 info_link_style" id="fp-own-funds"> <span class="m-cgg m-cgg-icon--chevron-right pl-icon-style"></span>&nbsp;</div></span> </div > <div class="cgg-row ng-scope"> <div class="cgg-col-md-12 ci-info-box__header ng-hide"> <span class="ci-info-box__header-text ng-binding"></span> <span class="m-cgg m-cgg-icon--chevron-right ci-info-box__header-edit-icon"></span> </div><span class="ng-scope"> <div class="cgg-col-md-6 cgg-col-lg-6 cgg-col-sm-6 cgg-col-xs-6 text-left text-bold text-ellipsis ng-binding">' +
  locales[lang]["loanAmount"] +
  '</div><div class="cgg-col-md-6 cgg-col-lg-6 cgg-col-sm-6 cgg-col-xs-6 info_link_style" id="fp-loan-amount"> <span class="m-cgg m-cgg-icon--chevron-right pl-icon-style"></span>&nbsp;</div></span></div></div >';

/*
SECTION: define formulas
*/
// Get data and compute the financial plan variables
function computeFP() {
  // update the variables with the latest value
  var backTranslation = { Bruxelles: "brussels", Wallonie: "wallonia", Flandre: "flanders", yes: true, no: false }; // Funnel values are in French instead of English

  if (typeof angular !== "undefined" && typeof angular.element(document.getElementsByName('FormService.form.funnelPageForm')).scope() !== "undefined") {
    formScope = angular.element(document.getElementsByName('FormService.form.funnelPageForm')).scope();
    regionInfo = formScope.getFormattedCurrentStepData(formScope.modelInfo.stepInfoContainer["regionAndTaxesInformation"], "cggId", "gtmId");
    investmentInfo = formScope.getFormattedCurrentStepData(formScope.modelInfo.stepInfoContainer["borrowWithPercentageLocked"], "cggId", "gtmId");

    region = backTranslation[regionInfo.propertyRegion];
    firstProperty = backTranslation[regionInfo.firstProperty];
    if (investmentInfo.propertyValue) propertyValue = parseFloat(investmentInfo.propertyValue);
    if (investmentInfo.ownFunds) ownFunds = parseFloat(investmentInfo.ownFunds);
  }

  // compute the costs only if propertyValue is set (avoid showing costs before even starting the funnel)
  if (propertyValue) {
    if (region == "brussels" && firstProperty && propertyValue <= 500000) {
      regionalDeduction = Math.min(propertyValue, 175000);
    } else if (region == "flanders" && firstProperty && propertyValue <= 200000) {
      regionalDeduction = Math.min(propertyValue, 80000);
    } else if (region == "wallonia" && firstProperty) {
      regionalDeduction = Math.min(propertyValue, 20000);
    } else {
      regionalDeduction = 0;
    }

    if (region == "flanders" && firstProperty) {
      registrationFees = (propertyValue - regionalDeduction)* 0.07;
    }else{
      registrationFees = (propertyValue - regionalDeduction) * regionalFees[region];
    }

    notaryFixedFee = notaryMatrix[getStaircaseRow(notaryMatrix, propertyValue)][notaryFixedRateCol] * VAT + notaryFixedCost;
    notaryVariablePercentage = notaryMatrix[getStaircaseRow(notaryMatrix, propertyValue)][notaryPercentageCol] * VAT;

    notaryFeesMax = propertyValue * notaryVariablePercentage + notaryFixedFee;

    totalAmount = propertyValue + notaryFeesMax + registrationFees - ownFunds;
    mortgageFeesMax = mortgageMatrix[getStaircaseRow(mortgageMatrix, totalAmount)][mortgagePercentageCol] * totalAmount + mortgageMatrix[getStaircaseRow(mortgageMatrix, totalAmount)][mortgageFixedRateCol] - totalAmount;
  }
}
// Transform the numbers in nice currency format
function formatCurrency(num) {
  return (
    "€ " + num.toFixed().replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")
  );
}

// Update the financial plan
function updateFP() {
  computeFP();
  // Check if financial plan DOM is present, otherwise build it. For some reason, it does not work in $().ready
  if (document.getElementById("fp-registration-fees") != null) {
    document.getElementById("fp-registration-fees").lastChild.nodeValue = formatCurrency(registrationFees);
    document.getElementById("fp-notary-fees").lastChild.nodeValue = formatCurrency(notaryFeesMax);
    document.getElementById("fp-mortgage-fees").lastChild.nodeValue = formatCurrency(mortgageFeesMax);
    document.getElementById("fp-total-cost").lastChild.nodeValue = formatCurrency(propertyValue + parseFloat(registrationFees) + parseFloat(notaryFeesMax) + parseFloat(mortgageFeesMax) );
    document.getElementById("fp-own-funds").lastChild.nodeValue = formatCurrency(-ownFunds);
    document.getElementById("fp-loan-amount").lastChild.nodeValue = formatCurrency(propertyValue + parseFloat(registrationFees) + parseFloat(notaryFeesMax) + parseFloat(mortgageFeesMax) - ownFunds);
  } else {
    $(".ci-info-box").prepend(boxFP);
  }
}

// Read cookie (used for retrieving the analytics_id)
function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Retrieve geolocation information and store in geoObject
// Source:https://medium.com/@adeyinkaadegbenro/how-to-detect-the-location-of-your-websites-visitor-using-javascript-92f9e91c095f
// providers: https://ipinfo.io/json (works fine but inaccurate), https://geoip-db.com/jsonp (works with proper ajax call and accurate enough), http://ip-api.com/ (most accurate but cannot call over https)
var geoObject;
function ipLookUp() {
  $.ajax({
    url: "https://geoip-db.com/jsonp",
    jsonpCallback: "callback",
    dataType: "jsonp",
    success: function(location) {
      geoObject = location;
    }
  });
}

// Capture information (source: https://gist.github.com/mhawksey/1276293)
function logUserData() {
  var analyticsID = readCookie("analytics_id");
  var funnelData = sessionStorage.getItem("cggCore.formData");
  var geoData = JSON.stringify(geoObject);
  var emailConsent = $("input[name=consent]").prop("checked");
  // add: second borrower, highlights
  var serializedData =
    "funnelData=" +
    funnelData +
    "&geoData=" +
    geoData +
    "&analyticsID=" +
    analyticsID +
    "&emailConsent=" +
    emailConsent +
    "&lang=" +
    lang;
  request = $.ajax({
    url:
      "https://script.google.com/macros/s/AKfycbzyMSvOpJVyYSkK42FPpWPZztoz4I2DNWpJKdNsL9Do-DuRvURZ/exec",
    type: "post",
    data: serializedData
  });
}

/*
SECTION: Loaders
*/
$(document).ready(function() {
  // Load funnel things
  if (window.location.href.indexOf("etapes") + window.location.href.indexOf("stappen") > -1 ) {
    ipLookUp();
    updateFP();
  }

  var checkExist = setInterval(function() {
    // binding to the input events is more cumbersome and unstable than refreshing periodically
    updateFP();

    // Hide back button in step 2 for as long as there is no other purpose
    if (window.location.href.indexOf("step/2") > - 1 ) {
      if ($(".go-back-button.ng-scope").is(":visible")) $(".go-back-button.ng-scope").hide();
    } else {
      $(".go-back-button.ng-scope").show();
    }
    
    // Apply HypoConnect branding
    if (window.location.href.indexOf("step/4") + window.location.href.indexOf("step/5") + window.location.href.indexOf("step/6") > -1 ) {
      $("body").addClass("hypoconnect");
      if ($("#disclaimerHC").length == 0) {
        $("[ng-switch-when='cgg-headline-description']").after(
          '<span id="disclaimerHC" style="display: block; margin: -10px 0 20px 0">' +
            locales[lang]["disclaimerTopHC"] +
            "<br></span>"
        );
      }
      $("application-skip-link").text(locales[lang]["disclaimerBottomHC"]);
    } else {
      $("body").removeClass("hypoconnect");
    }

    // Notify for employment special cases
    if ( window.location.href.indexOf("step/7") > -1 && $("#highlightEmploymentStatus").length == 0 ) {
      $('select[name="employmentStatus"]').parent().after(highlightEmploymentStatus);
    }
    if ( /independent|liberal_professional|company_manager/.test($('select[name="employmentStatus"] option:selected').val() )
    ) {
      $("#highlightEmploymentStatus").removeClass("ng-hide");
    } else {
      $("#highlightEmploymentStatus").addClass("ng-hide");
    }

    // Notify for LTV > 100%
    if (      window.location.href.indexOf("step/3") > -1 && $("#highlightLTV").length == 0    ) {
      $('input[name="ownFunds"]').parent().parent().parent().parent().after(highlightLTV);
    }
    if (      $("input[name=ownFunds]").val() != "" && totalAmount / propertyValue > 1.05    ) {
      $("#highlightLTV").removeClass("ng-hide");
      //TODO: store the information in a cookie to pass over to unbounce
    } else {
      $("#highlightLTV").addClass("ng-hide");
      //TODO: remove the information from the above cookie
    }

    if (window.location.href.indexOf("step/8") > -1) {
      // use the blur event of the email field to trigger the logUserData function. In order to bind only once, make sure only bind if there is no more than the two default events binded to that field
      if ( jQuery._data($("input[name=email]")[0], "events")["blur"].length < 3 ) {
        $("input[name=email]").blur(function() { logUserData(); });
      }
    }

    // Load results table things
    if ( window.location.href.indexOf("pret-hypothecaire/tous/results") + window.location.href.indexOf("hypothecaire-lening/alle/results") > -1 ) {
      $("body").addClass("hl-rt");
      // Use the exclusivity banner to mark the HypoConnect products
      if (!$(".results-container").hasClass("tc-touched")) {
        console.log("Applying changes for " + i + " out of " + $(".card-container").length);
        for (var i =0; i< $(".card-container").length; i++) {
          if($(".card-container").eq(i).find(".product-label:contains('Excl')").length) {
                console.log("Processing HC connect card " + i  + " out of " + $(".card-container").length);
                $(".card-container").eq(i).find(".banner-title.exclusive").text(locales[lang]["bannerLabel"]);
                $(".card-container").eq(i).find(".product-label:contains('Exclu')").text(locales[lang]["bannerLabel"]);
                $(".card-container").eq(i).find(".product-label:contains('HypoConnect')").parent().parent().css('background', 'rgba(141, 22, 86, 0.15)');
          }else{ 
            console.log("Processing non-HC connect card " + i  + " out of " + $(".card-container").length);
            $(".card-container").eq(i).find(".product-label").get(0).setAttribute("style", "background-color: transparent !important");
            $(".card-container").eq(i).find("button").hide();
          }
        }
        $(".results-container").addClass("tc-touched");
      } else {
        console.log("no change needed");
      }
      // Add APR/TAEG assumption in the disclaimer
      $(".cgg-category-disclaimer").html(locales[lang]["disclaimerResultsHC"]);
  
    }
  }, 100);
});
