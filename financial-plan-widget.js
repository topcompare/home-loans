/* This is a custom script and contains the following features:
- Adds a financial plan on the right pane of the funnel (desktop only)
- Is being loaded with GTM and updates on every form input keystroke
*/

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
    loanAmount: "Montant à emprunter"
  },
  nl: {
    title: "Je financieel plan",
    brussels: "Brussel",
    flanders: "Vlaanderen",
    wallonia: "Wallonië",
    registrationRights: "Registratierechten",
    mortgageFees: "Hypotheekkosten",
    notaryFees: "Notariskosten voor de aankoop",
    totalCost: "Totale kosten van het project",
    ownFunds: "- Persoonlijke bijdrage",
    loanAmount: "Totaal lening"
  }
};

var lang = "fr";
if (document.documentElement.lang == "nl-BE") {
  lang = "nl";
}
var regionalFees = { brussels: 0.125, wallonia: 0.125, flanders: 0.1 },
  region = "brussels";
var notaryFixedCost = 2178;
var discountValue = 160353;
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
  if (matrix[0][0] > value) {
    return 0;
  }
  for (var i = 0; i < matrix.length; i++) {
    if (matrix[i][0] - value > 0) {
      return i - 1;
    } else if (value >= matrix[matrix.length - 1][0]) {
      return matrix.length - 1;
    }
  }
}

/*
SECTION: Create DOM structure
*/
// Desktop structure
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

// Mobile structure
var mobileFP = '<div class="cgg-row ng-scope"> <div class="cgg-col-md-12 info_down_half__header ng-hide" > <span class="info_down_half__header-text ng-binding"></span> <a href="" class="info_down_half__header-edit ng-binding"><span class="m-cgg m-cgg-icon--chevron-right info_down_half__header-edit-icon"></span> </a> </div> <div class="info_down_half--label cgg-col-md-6 cgg-col-lg-6 cgg-col-sm-6 cgg-col-xs-6 text-left text-bold ng-binding ng-scope">'+locales[lang]["registrationRights"]+'</div> <div class="cgg-col-md-6 cgg-col-lg-6 cgg-col-sm-6 cgg-col-xs-6 info_link_style ng-scope" id="fp-registration-fees-sm"> <span class="m-cgg m-cgg-icon--chevron-right info_down_half--arrow pl-icon-style"></span>&nbsp;</div> </div>';
mobileFP += '<div class="cgg-row ng-scope"> <div class="cgg-col-md-12 info_down_half__header ng-hide" > <span class="info_down_half__header-text ng-binding"></span> <a href="" class="info_down_half__header-edit ng-binding"><span class="m-cgg m-cgg-icon--chevron-right info_down_half__header-edit-icon"></span> </a> </div> <div class="info_down_half--label cgg-col-md-6 cgg-col-lg-6 cgg-col-sm-6 cgg-col-xs-6 text-left text-bold ng-binding ng-scope">'+locales[lang]["notaryFees"]+'</div> <div class="cgg-col-md-6 cgg-col-lg-6 cgg-col-sm-6 cgg-col-xs-6 info_link_style ng-scope" id="fp-notary-fees-sm"> <span class="m-cgg m-cgg-icon--chevron-right info_down_half--arrow pl-icon-style"></span>&nbsp;</div> </div>';
mobileFP += '<div class="cgg-row ng-scope"> <div class="cgg-col-md-12 info_down_half__header ng-hide" > <span class="info_down_half__header-text ng-binding"></span> <a href="" class="info_down_half__header-edit ng-binding"><span class="m-cgg m-cgg-icon--chevron-right info_down_half__header-edit-icon"></span> </a> </div> <div class="info_down_half--label cgg-col-md-6 cgg-col-lg-6 cgg-col-sm-6 cgg-col-xs-6 text-left text-bold ng-binding ng-scope">'+locales[lang]["mortgageFees"]+'</div> <div class="cgg-col-md-6 cgg-col-lg-6 cgg-col-sm-6 cgg-col-xs-6 info_link_style ng-scope" id="fp-mortgage-fees-sm"> <span class="m-cgg m-cgg-icon--chevron-right info_down_half--arrow pl-icon-style"></span>&nbsp;</div> </div>';
mobileFP += '<div class="cgg-row ng-scope"> <div class="cgg-col-md-12 info_down_half__header ng-hide" > <span class="info_down_half__header-text ng-binding"></span> <a href="" class="info_down_half__header-edit ng-binding"><span class="m-cgg m-cgg-icon--chevron-right info_down_half__header-edit-icon"></span> </a> </div> <div class="info_down_half--label cgg-col-md-6 cgg-col-lg-6 cgg-col-sm-6 cgg-col-xs-6 text-left text-bold ng-binding ng-scope">'+locales[lang]["totalCost"]+'</div> <div class="cgg-col-md-6 cgg-col-lg-6 cgg-col-sm-6 cgg-col-xs-6 info_link_style ng-scope" id="fp-total-cost-sm"> <span class="m-cgg m-cgg-icon--chevron-right info_down_half--arrow pl-icon-style"></span>&nbsp;</div> </div>';
mobileFP += '<div class="cgg-row ng-scope"> <div class="cgg-col-md-12 info_down_half__header ng-hide" > <span class="info_down_half__header-text ng-binding"></span> <a href="" class="info_down_half__header-edit ng-binding"><span class="m-cgg m-cgg-icon--chevron-right info_down_half__header-edit-icon"></span> </a> </div> <div class="info_down_half--label cgg-col-md-6 cgg-col-lg-6 cgg-col-sm-6 cgg-col-xs-6 text-left text-bold ng-binding ng-scope">'+locales[lang]["ownFunds"]+'</div> <div class="cgg-col-md-6 cgg-col-lg-6 cgg-col-sm-6 cgg-col-xs-6 info_link_style ng-scope" id="fp-own-funds-sm"> <span class="m-cgg m-cgg-icon--chevron-right info_down_half--arrow pl-icon-style"></span>&nbsp;</div> </div>';
mobileFP += '<div class="cgg-row ng-scope"> <div class="cgg-col-md-12 info_down_half__header ng-hide" > <span class="info_down_half__header-text ng-binding"></span> <a href="" class="info_down_half__header-edit ng-binding"><span class="m-cgg m-cgg-icon--chevron-right info_down_half__header-edit-icon"></span> </a> </div> <div class="info_down_half--label cgg-col-md-6 cgg-col-lg-6 cgg-col-sm-6 cgg-col-xs-6 text-left text-bold ng-binding ng-scope">'+locales[lang]["loanAmount"]+'</div> <div class="cgg-col-md-6 cgg-col-lg-6 cgg-col-sm-6 cgg-col-xs-6 info_link_style ng-scope" id="fp-loan-amount-sm"> <span class="m-cgg m-cgg-icon--chevron-right info_down_half--arrow pl-icon-style"></span>&nbsp;</div> </div>';


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
    } else if (region == "wallonia" && regionInfo.useDiscountedFee) {
    registrationFees = Math.min(propertyValue - regionalDeduction, discountValue) * 0.06 + Math.max(propertyValue - regionalDeduction - discountValue, 0) * regionalFees[region];
    } else{
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
    document.getElementById("fp-loan-amount").lastChild.nodeValue = formatCurrency(Math.max(propertyValue + parseFloat(registrationFees) + parseFloat(notaryFeesMax) + parseFloat(mortgageFeesMax) - ownFunds, 0));
  } else {
    $(".ci-info-box").prepend(boxFP);
  }
  // To the same for mobile
  if (document.getElementById("fp-registration-fees-sm") != null) {
    document.getElementById("fp-registration-fees-sm").lastChild.nodeValue = formatCurrency(registrationFees);
    document.getElementById("fp-notary-fees-sm").lastChild.nodeValue = formatCurrency(notaryFeesMax);
    document.getElementById("fp-mortgage-fees-sm").lastChild.nodeValue = formatCurrency(mortgageFeesMax);
    document.getElementById("fp-total-cost-sm").lastChild.nodeValue = formatCurrency(propertyValue + parseFloat(registrationFees) + parseFloat(notaryFeesMax) + parseFloat(mortgageFeesMax) );
    document.getElementById("fp-own-funds-sm").lastChild.nodeValue = formatCurrency(-ownFunds);
    document.getElementById("fp-loan-amount-sm").lastChild.nodeValue = formatCurrency(Math.max(propertyValue + parseFloat(registrationFees) + parseFloat(notaryFeesMax) + parseFloat(mortgageFeesMax) - ownFunds, 0));
  } else {
	// Create new section on mobile
	$(".cgg-step-info-mobile > .info_down_half").eq(0).before('<div class="info_down_half"></div>');
	// Add lines on mobile
	$(".cgg-step-info-mobile > .info_down_half").eq(0).append(mobileFP);

  }
}

/*
SECTION: Loader
*/

  // Load FP only if we are in the funnel
  if (window.location.href.indexOf("etapes") + window.location.href.indexOf("stappen") > -1 ) {
	updateFP();
	// bind form change events to update the financial plan (probably too many events but need to be sure it works)
	$("form :input").keydown(function() {
		updateFP();
	});
	$('form').bind('DOMSubtreeModified', function(e) {
      		updateFP();
  	});
  }
