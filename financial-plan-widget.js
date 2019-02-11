var lang = document.documentElement.lang;

/*
SECTION: Set variables and base values
*/
var locales = {
	fr: {
		'title' : 'Votre plan financier',
		'brussels' : 'Bruxelles',
		'flanders' : 'Flandre',
		'wallonia': 'Wallonie',
		'registrationRights' : 'Droits d\'enregistrement',
		'mortgageFees' : 'Frais liés au crédit hypothécaire',
		'notaryFees' : 'Frais de notaire',
		'totalCost': 'Coût total du projet',
		'highlightEmploymentStatus': ' Ce statut professionnel a des conditions spéciales pour les taux. Nous afficherons les taux standards mais le courtier sera informé de votre statut afin de vous proposer le meilleur taux.',
		'highlightLTV': ' Vous ne disposez pas de suffisamment de fonds propres pour financer votre projet. Peu de banques accordent un prêt hypothécaire avec une quotité  supérieure à 100%.',
		'disclaimerTopHC' : 'Vos données seront envoyées à et traitées par HypoConnect SA, courtier en crédit hypothécaire, pour fournir un TAEG plus précis et une éligibilité préliminaire testée auprès des 15+ banques partenaires de HypoConnect. En soumettant votre recherche, vous donnez implicitement votre accord pour l’utilisation de vos données à ces fins.',
		'disclaimerBottomHC': 'This page, which is under the responsibility of HypoConnect NV, is hosted by TopCompare Information Services Belgium.',
		'disclaimerResultsHC': 'This product overview is hosted by TopCompare Information Services Belgium BVBA. HypoConnect NV features products from broker banks (purple color), indicating your likelihood of approval and a more personalized APR using your personal and financial information. Any indication of APR or likelihood of approval is not binding, the final conditions are the ultimate responsibility of the bank. TopCompare Information Services Belgium BVBA features products from non-broker banks, only using the information about your mortgage project.',
		'disclaimerEmail' : 'En procédant au tableau de résultats, j\'accepte explicitement que TopCompare réutilise les données précédemment complétées à des fins marketing et de future comparaison.',
		'bannerLabel' : 'HypoConnect'
	},
	nl: {
		'title' : 'Uw financieel plan',
		'brussels' : 'Brussel',
		'flanders' : 'Vlaanderen',
		'wallonia': 'Wallonië',
        'registrationRights' : 'Registratierechten',
        'mortgageFees' : 'Hypotheekkosten',
        'notaryFees' : 'Notariskosten',
        'totalCost': 'Totale kosten van het project',
		'highlightEmploymentStatus': ' Ce statut professionnel a des conditions spéciales pour les taux. Nous afficherons les taux standards mais le courtier sera informé de votre statut afin de vous proposer le meilleur taux.',
		'highlightLTV': ' Vous ne disposez pas de suffisamment de fonds propres pour financer votre projet. Peu de banques accordent un prêt hypothécaire avec une quotité  supérieure à 100%. Nous afficherons les taux standards mais le courtier sera informé de votre situation afin de vous proposer le meilleur taux.',
		'disclaimerTopHC' : 'Uw gegevens worden verzonden naar en verwerkt door HypoConnect hypotheekmakelaar om een nauwkeuriger JKP en voorlopige geschiktheid getest met de 15+ partner banken van HypoConnect. Door het indienen van uw simulatie gaat u impliciet akkoord met het gebruik van uw gegevens voor deze doeleinden.',
		'disclaimerBottomHC': 'This page, which is under the responsibility of HypoConnect NV, is hosted by TopCompare Information Services Belgium.',
		'disclaimerResultsHC': 'This product overview is hosted by TopCompare Information Services Belgium BVBA. HypoConnect NV features products from broker banks (purple color), indicating your likelihood of approval and a more personalized APR using your personal and financial information. Any indication of APR or likelihood of approval is not binding, the final conditions are the ultimate responsibility of the bank. TopCompare Information Services Belgium BVBA features products from non-broker banks, only using the information about your mortgage project.',
		'disclaimerEmail' : 'Door naar de resultatentabel te gaan, accepteer ik uitdrukkelijk dat TopCompare de eerder ingevulde gegevens opnieuw gebruikt voor marketing en toekomstige vergelijkingen.',
		'bannerLabel' : 'HypoConnect'
	}
};
var lang = 'fr';
if (document.documentElement.lang == "nl-BE") lang = 'nl';
var formData;
var regionalFees = {'brussels': 0.125, 'wallonia': 0.125, 'flanders': 0.10};
var notaryFixedCost = 2178;
var adminFeesMin = 800, adminFeesMax = 1100;
var VAT = 1.21;
var mortgageOfficeTrans = 230;
var adminFeesMGMin = 700, adminFeesMGMax = 1000;
var registrationRights, mortgageOfficeFees, registrationFees, notaryFeesMax, mortgageFeesMax, totalAmount, notaryVariablePercentage,notaryFixedFee;
var ownFunds = 0, propertyValue = 0;

var notaryMatrix = [
	[0,0.0456,0],
	[7500,0.0285,128.25],
	[17500,0.0228,228],
	[30000,0.0171,399],
	[45495,0.0114,658.3215],
	[64095,0.0057,1023.663],
	[250095,0.00057,2306.65035]
];
var mortgageMatrix = [
	[-1902.44, 	1.036259776191308,	1971.4220486173917],
   	[5335.127425000001,	1.0318350094994342,	1995.0287427444325],
   	[15026.599325, 	1.0259937675598192,	2082.8027449314154],
   	[22312.32525, 	1.0259937675598192,	2107.693353732415],
   	[27185.6492, 	1.023097877144545,	2186.4200146837047],
   	[42330.82772705, 	1.0202182881494126,	2308.3154003613545],
   	[46722.289394, 	1.0202182881494126,	2333.0658960318615],
   	[60537.96018105, 	1.0173548633158815,	2506.411794585595],
   	[71232.673858, 	1.0173548633158815,	2531.092823569648],
   	[95781.943608, 	1.0173548633158815,	2555.773852553686],
   	[120331.213358, 	1.0173548633158815,	2580.454881537739],
   	[144880.48310800001,	1.0173548633158815,	2605.135910521762],
   	[169429.752858, 	1.0173548633158815,	2629.816939505815],
   	[193979.022608, 	1.0173548633158815,	2654.497968489867],
   	[218528.292358, 	1.0173548633158815,	2679.1789974738904],
   	[243077.562108, 	1.0173548633158815,	2703.860026457943],
   	[243170.94152105, 	1.0150756703892165,	3258.093516343205],
   	[267681.7981892, 	1.0150756703892165,	3282.7192521068273],
   	[292286.2439392, 	1.0150756703892165,	3307.344987870479],
   	[316890.6896892, 	1.0150756703892165,	3331.970723634131],
   	[341495.1354392, 	1.0150756703892165,	3356.596459397783],
   	[366099.5811892, 	1.0150756703892165,	3381.2221951614347],
   	[390704.0269392, 	1.0150756703892165,	3405.8479309250274],
   	[415308.4726892, 	1.0150756703892165,	3430.4736666886793],
   	[439912.9184392, 	1.0150756703892165,	3455.09940245239],
   	[464517.3641892, 	1.0150756703892165,	3479.725138215983],
   	[488636.6149392, 	1.0160765253564337,	3507.8061306480854]
]; 

var notaryPercentageCol = 1;
var notaryFixedRateCol = 2;
var notaryFixedCost = 2178;

var mortgagePercentageCol = 1;
var mortgageFixedRateCol = 2;

function getStaircaseRow(matrix,value) {
	for (var i = 0; i < matrix.length; i++) {
		if((matrix[i][0]-value) >0 ) { 
			return i;
		} else if (value>=matrix[matrix.length-1][0]) {
			return i;
		}
	}
}

/*
SECTION: Create DOM structure
*/
// Prepare highlight boxes for exception cases
var highlightEmploymentStatus = '<div class="cgg-global-input--error-notification ng-binding ng-hide" ng-show="showErrorMessage" style="margin-top: -10px; margin-bottom: 10px" id="highlightEmploymentStatus"><span class="cgg-has-error-msg-icn m-cgg js-newsletter-submit-icon m-cgg-icon--warning"></span>'+locales[lang]['highlightEmploymentStatus']+'</div>';
var highlightLTV = '<div class="cgg-global-input--error-notification ng-binding ng-hide" ng-show="showErrorMessage" style="margin-top: -10px; margin-bottom: 10px" id="highlightLTV"><span class="cgg-has-error-msg-icn m-cgg js-newsletter-submit-icon m-cgg-icon--warning"></span>'+locales[lang]['highlightLTV']+'</div>';
var boxFP = '<div class="info_up_half"> <span class="info_up_half--title ng-binding">'+locales[lang]['title']+'</span> </div><div class="info_down_half"><div class="radio-toolbar"><input type="radio" id="radio1" name="region" value="brussels" checked><label for="radio1">'+locales[lang]['brussels']+'</label><input type="radio" id="radio2" name="region" value="flanders"><label for="radio2">'+locales[lang]['flanders']+'</label><input type="radio" id="radio3" name="region" value="wallonia"><label for="radio3">'+locales[lang]['wallonia']+'</label></div><div class="cgg-row ng-scope"> <div class="cgg-col-md-12 ci-info-box__header ng-hide"> <span class="ci-info-box__header-text ng-binding"></span> <span class="m-cgg m-cgg-icon--chevron-right ci-info-box__header-edit-icon"></span> </div><span class="ng-scope"> <div class="cgg-col-md-6 cgg-col-lg-6 cgg-col-sm-6 cgg-col-xs-6 text-left text-bold text-ellipsis ng-binding" title="Droits d\'enregistrement">'+locales[lang]['registrationRights']+'</div><div class="cgg-col-md-6 cgg-col-lg-6 cgg-col-sm-6 cgg-col-xs-6 info_link_style" id="fp-registration-fees"> <span class="m-cgg m-cgg-icon--chevron-right pl-icon-style"></span>...</div></span> </div><div class="cgg-row ng-scope"> <div class="cgg-col-md-12 ci-info-box__header ng-hide"> <span class="ci-info-box__header-text ng-binding"></span> <span class="m-cgg m-cgg-icon--chevron-right ci-info-box__header-edit-icon"></span> </div><span class="ng-scope"> <div class="cgg-col-md-6 cgg-col-lg-6 cgg-col-sm-6 cgg-col-xs-6 text-left text-bold text-ellipsis ng-binding">'+locales[lang]['notaryFees']+'</div><div class="cgg-col-md-6 cgg-col-lg-6 cgg-col-sm-6 cgg-col-xs-6 info_link_style" id="fp-notary-fees"> <span class="m-cgg m-cgg-icon--chevron-right pl-icon-style"></span>...</div></span> </div><div class="cgg-row ng-scope"> <div class="cgg-col-md-12 ci-info-box__header ng-hide"> <span class="ci-info-box__header-text ng-binding"></span> <span class="m-cgg m-cgg-icon--chevron-right ci-info-box__header-edit-icon"></span> </div><span class="ng-scope"> <div class="cgg-col-md-6 cgg-col-lg-6 cgg-col-sm-6 cgg-col-xs-6 text-left text-bold text-ellipsis ng-binding">'+locales[lang]['mortgageFees']+'</div><div class="cgg-col-md-6 cgg-col-lg-6 cgg-col-sm-6 cgg-col-xs-6 info_link_style" id="fp-mortgage-fees"> <span class="m-cgg m-cgg-icon--chevron-right pl-icon-style"></span>...</div></span> </div><div class="cgg-row ng-scope"> <div class="cgg-col-md-12 ci-info-box__header ng-hide"> <span class="ci-info-box__header-text ng-binding"></span> <span class="m-cgg m-cgg-icon--chevron-right ci-info-box__header-edit-icon"></span> </div><span class="ng-scope"> <div class="cgg-col-md-6 cgg-col-lg-6 cgg-col-sm-6 cgg-col-xs-6 text-left text-bold text-ellipsis ng-binding" title="Coût total du projet">'+locales[lang]['totalCost']+'</div><div class="cgg-col-md-6 cgg-col-lg-6 cgg-col-sm-6 cgg-col-xs-6 info_link_style" id="fp-total-cost"> <span class="m-cgg m-cgg-icon--chevron-right pl-icon-style"></span>...</div></span></div></div>';

// Remove promo box. Best to put to css stylesheet to prevent it from appearing in the first place
// $(".cgg-promotion-info").hide(); // done in CSS
// Add box for the financial plan
$(".ci-info-box").prepend(boxFP);

// Style the financial plan (can be beautified if GTM is used)
// var style = document.createElement('style'); // done in CSS
// style.type = 'text/css';
// style.innerHTML = '.radio-toolbar input[type=radio]{display:none}.radio-toolbar label{display:inline-block;padding:4px 11px;margin:0 10px 10px 0;cursor:pointer;width:95px;text-align:center;border:1px solid #77aa43}.radio-toolbar input[type=radio]:checked+label{background-color:#77aa43;color:#fff}';
// document.getElementsByTagName('head')[0].appendChild(style);

// HypoConnect branding
//var style = document.createElement('style'); // done in CSS
//style.type = 'text/css';
//style.innerHTML = 'body.hypoconnect{background-color:#e0edee}body.hypoconnect .cgg-progress__bar{background-color:#8d1656 !important}body.hypoconnect .cgg-progress__bar-container{background-color:#5e6e82 !important}body.hypoconnect .cgg-progress__step-icon.cgg-progress__highlighted{background-color:#8d1656;border-color:#8d1656}body.hypoconnect .cgg-progress__step-icon.cgg-progress__notHighlighted{border:2px solid #5a6e84 !important;background-color:#eff9f9}body.hypoconnect .cgg-headline-description__headline{color:#333}body.hypoconnect .cgg-group-button .continue-button{background-color:#9a0058;border-color:#9a0058}body.hypoconnect .cgg-group-button .go-back-button{background-color:#FFF;border:1px solid #004f9a}body.hypoconnect .cgg-group-button .go-back-button>span{color:#004f9a}body.hypoconnect .cgg-info-box,body.hypoconnect .ci-info-box{box-shadow:5px 5px 0 1px #cadddf;color:#004f9a}body.hypoconnect .ci-info-box>.info_up_half{border-bottom-color:#004f9a}body.hypoconnect .cgg-global-input{border:1px solid #FFF}body.hypoconnect .funnel-page__step-container:before{content:"";width:100px;height:50px;background:url(https://www.patronale-life.be/sites/default/files/styles/paragraaf_image/public/fotos/hypoconnect-logo.png?itok=8-nMF24L) no-repeat;background-size:100%;display:block;margin:0}body.hypoconnect .cgg-progress__step-icon i,body.hypoconnect .m-cgg-icon--chevron-right,body.hypoconnect .cgg-hint__header a.cgg-help,body.hypoconnect .ci-info-box .ci-info-box__selectedLink.ci-info-box__selectedLink,body.hypoconnect .ci-info-box .info_link_style a{color:#9a0058}body.hypoconnect .radio-toolbar label{border:1px solid #9a0058}body.hypoconnect .radio-toolbar input[type=radio]:checked+label{background-color:#9a0058}';
//document.getElementsByTagName('head')[0].appendChild(style);

/*
SECTION: define formulas
*/
// Get data and compute the financial plan variables
function computeFP() {
	// update the variables with the latest value
	if ($('input[name=ownFunds]').val()) {
		ownFunds = parseFloat($('input[name=ownFunds]').val().replace(/\D/g,''));
		propertyValue = parseFloat($('input[name=propertyValue]').val().replace(/\D/g,''));
	}else if (sessionStorage.getItem('cggCore.formData') !== null ){
		formData = jQuery.parseJSON(sessionStorage.getItem('cggCore.formData'));
		if (formData["propertyValue"]) propertyValue = parseFloat(formData["propertyValue"]);
		if (formData["ownFunds"]) ownFunds = parseFloat(formData["ownFunds"]);
	}else{ //we have a problem! It might happen that the funnel has stored the values but that there is nothing in cggCore.formData --> How can it be?
		// do nothing, keep the value in the variables
		console.log("Warning: Cannot capture property value and own funds fields!");
	}
	// compute the costs
	registrationFees = propertyValue*regionalFees[$('input[name=region]:checked').val()];

	notaryFixedFee = ( notaryMatrix[getStaircaseRow(notaryMatrix,propertyValue)][notaryFixedRateCol] * VAT) + notaryFixedCost;
	notaryVariablePercentage = notaryMatrix[getStaircaseRow(notaryMatrix,propertyValue)][notaryPercentageCol]*VAT;
	notaryFeesMax = (propertyValue*notaryVariablePercentage) + notaryFixedFee;

	totalAmount = propertyValue + notaryFeesMax + registrationFees - ownFunds;
 	mortgageFeesMax = ( mortgageMatrix[getStaircaseRow(mortgageMatrix,totalAmount)][mortgagePercentageCol] * totalAmount ) + mortgageMatrix[getStaircaseRow(mortgageMatrix,totalAmount)][mortgageFixedRateCol] - totalAmount;

}
// Transform the numbers in nice currency format
function formatCurrency(num) {
	return '€ ' + num.toFixed(0).replace('.',',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
}

// Update the financial plan
function updateFP(){
	computeFP();
	document.getElementById("fp-registration-fees").lastChild.nodeValue = formatCurrency(registrationFees);
	document.getElementById("fp-notary-fees").lastChild.nodeValue = formatCurrency(notaryFeesMax);	
	document.getElementById("fp-mortgage-fees").lastChild.nodeValue = formatCurrency(mortgageFeesMax);
	document.getElementById("fp-total-cost").lastChild.nodeValue = formatCurrency(propertyValue + parseFloat(registrationFees) + parseFloat(notaryFeesMax) + parseFloat(mortgageFeesMax));
}

// Read cookie (used for retrieving the analytics_id)
function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}

// Retrieve geolocation information and store in geoObject
// Source:https://medium.com/@adeyinkaadegbenro/how-to-detect-the-location-of-your-websites-visitor-using-javascript-92f9e91c095f
// providers: https://ipinfo.io/json (works fine but inaccurate), https://geoip-db.com/jsonp (works with proper ajax call and accurate enough), http://ip-api.com/ (most accurate but cannot call over https)
var geoObject;
function ipLookUp () {
	$.ajax({
		url: "https://geoip-db.com/jsonp",
		jsonpCallback: "callback",
		dataType: "jsonp",
		success: function( location ) {
			geoObject = location;
		}
	});	
}

// Capture information (source: https://gist.github.com/mhawksey/1276293)
function logUserData () {
	var analyticsID = readCookie("analytics_id");
	var funnelData = sessionStorage.getItem('cggCore.formData');
	var geoData = JSON.stringify(geoObject);
	// add: second borrower, highlights
	var serializedData = "funnelData="+funnelData+"&geoData="+geoData+"&analyticsID="+analyticsID;
	request = $.ajax({
		url: "https://script.google.com/macros/s/AKfycbzyMSvOpJVyYSkK42FPpWPZztoz4I2DNWpJKdNsL9Do-DuRvURZ/exec",
		type: "post",
		data: serializedData
	});
}

/*
SECTION: Loaders
*/
$( document ).ready(function() {
	// Load funnel things
	if(window.location.href.indexOf("etapes") + window.location.href.indexOf("stappen")> -1 ) {
		ipLookUp();
		updateFP();

		// FIME: wrong place! needs to load in step 2!
		// Listen to events in the form
		//let list = document.getElementsByName("propertyValue");
		//list[0].addEventListener("click", function() {console.log( $.now()); });
	//	$('input[type=radio][name=region]').click(function() { updateFP(); }); 
	//	$('input').blur(function() { updateFP(); }); 
		//could be generalized with $('input').change(function() { updateFP(); }); 
	}
	
	// Load results table things
	if(window.location.href.indexOf("results") > -1 ) {
		console.log("Changing product labels to HypoConnect");
		$('.banner-title.exclusive').text(locales[lang]['bannerLabel']);
		$('.product-label').text(locales[lang]['bannerLabel']);
	}
	
	var checkExist = setInterval(function() {
		// binding to the input events is more cumbersome and unstable than refreshing periodically
		updateFP();
		
		// apply HypoConnect branding
		if(window.location.href.indexOf("step/4")+window.location.href.indexOf("step/5")+window.location.href.indexOf("step/6") > -1) {
			$("body").addClass("hypoconnect");
			if ($("#disclaimerHC").length == 0) {
				$("[ng-switch-when='cgg-headline-description']").after('<span id="disclaimerHC" style="font-style:italic">'+locales[lang]['disclaimerTopHC']+'<br></span>')
			}
			$("application-skip-link").text(locales[lang]['disclaimerBottomHC']);
		} else {
			$("body").removeClass("hypoconnect");
		}
		
		// notify for employment special cases
		if(window.location.href.indexOf("step/6") > -1 && $("#highlightEmploymentStatus").length == 0) {
			$('select[name="employmentStatus"]').parent().after(highlightEmploymentStatus);
		}
		if (/independent|liberal_professional|company_manager/.test($('select[name="employmentStatus"] option:selected').val()) ) {
			$("#highlightEmploymentStatus").removeClass("ng-hide");
		} else {
			$("#highlightEmploymentStatus").addClass("ng-hide");	
		}
		
		// notify for LTV > 100%
		if(window.location.href.indexOf("step/2") > -1 && $("#highlightLTV").length == 0) {
			$('input[name="ownFunds"]').parent().parent().parent().parent().after(highlightLTV);
		}

		if ( totalAmount/propertyValue > 1.05 ) {
			$("#highlightLTV").removeClass("ng-hide");
			//TODO: store the information in a cookie to pass over to unbounce
		} else {
			$("#highlightLTV").addClass("ng-hide");	
			//TODO: remove the information from the above cookie
		}
		
		if(window.location.href.indexOf("step/7") > -1 ) {
		// use the blur event of the email field to trigger the logUserData function. In order to bind only once, make sure only bind if there is no more than the two default events binded to that field
			if (jQuery._data($('input[name=email]')[0], 'events')["blur"].length < 3 ) {
				$('input[name=email]').blur(function() {logUserData();});
			}
			$("application-step-template").children().last().text(locales[lang]['disclaimerEmail']);
		}
	
	}, 100);

});
