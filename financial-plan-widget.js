// set variables and base values
var lang = document.documentElement.lang; //use if clause to set FR / NL (and contains for be_FR)
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
	},
	nl: {
		'title' : 'Je financieel plan',
		'brussels' : 'Brussel',
		'flanders' : 'Vlaanderen',
		'wallonia': 'Wallonië',
		'registrationRights' : 'Droits d\'enregistrement',
		'mortgageFees' : 'Frais liés au crédit hypothécaire',
		'notaryFees' : 'Frais de notaire',
		'totalCost': 'Coût total du projet'
	}
};
var regionalFees = {'brussels': 0.125, 'wallonia': 0.125, 'flanders': 0.07};
var notaryHonorary = 1000; //FIXME: staircase on loanValue
var adminFeesMin = 800, adminFeesMax = 1100;
var VAT = 1.21;
var mortgageOfficeTrans = 230;
var adminFeesMGMin = 700, adminFeesMGMax = 1000;
var registrationRights, mortgageOfficeFees, notaryHonoraryMG, registrationFees, notaryFeesMax, mortgageFeesMax;
var formData;
var lang = 'fr';
if (document.documentElement.lang == "fr-BE") {
	lang = 'fr';
  } else if (document.documentElement.lang == "nl-BE") {
	lang = 'nl';
  } 

// create structure
$(".cgg-promotion-info").hide(); //maybe best to put to css stylesheet to prevent it from appearing in the first place
$(".ci-info-box").prepend('<div class="info_up_half"> <span class="info_up_half--title ng-binding">'+locales[lang]['title']+'</span> </div><div class="info_down_half"><div class="radio-toolbar"><input type="radio" id="radio1" name="region" value="brussels" checked><label for="radio1">'+locales[lang]['brussels']+'</label><input type="radio" id="radio2" name="region" value="flanders"><label for="radio2">'+locales[lang]['flanders']+'</label><input type="radio" id="radio3" name="region" value="wallonia"><label for="radio3">'+locales[lang]['wallonia']+'</label></div><div class="cgg-row ng-scope"> <div class="cgg-col-md-12 ci-info-box__header ng-hide"> <span class="ci-info-box__header-text ng-binding"></span> <span class="m-cgg m-cgg-icon--chevron-right ci-info-box__header-edit-icon"></span> </div><span class="ng-scope"> <div class="cgg-col-md-6 cgg-col-lg-6 cgg-col-sm-6 cgg-col-xs-6 text-left text-bold text-ellipsis ng-binding" title="Droits d\'enregistrement">'+locales[lang]['registrationRights']+'</div><div class="cgg-col-md-6 cgg-col-lg-6 cgg-col-sm-6 cgg-col-xs-6 info_link_style" id="fp-registration-fees"> <span class="m-cgg m-cgg-icon--chevron-right pl-icon-style"></span>dummy value 1</div></span> </div><div class="cgg-row ng-scope"> <div class="cgg-col-md-12 ci-info-box__header ng-hide"> <span class="ci-info-box__header-text ng-binding"></span> <span class="m-cgg m-cgg-icon--chevron-right ci-info-box__header-edit-icon"></span> </div><span class="ng-scope"> <div class="cgg-col-md-6 cgg-col-lg-6 cgg-col-sm-6 cgg-col-xs-6 text-left text-bold text-ellipsis ng-binding">'+locales[lang]['notaryFees']+'</div><div class="cgg-col-md-6 cgg-col-lg-6 cgg-col-sm-6 cgg-col-xs-6 info_link_style" id="fp-notary-fees"> <span class="m-cgg m-cgg-icon--chevron-right pl-icon-style"></span>dummy value 2</div></span> </div><div class="cgg-row ng-scope"> <div class="cgg-col-md-12 ci-info-box__header ng-hide"> <span class="ci-info-box__header-text ng-binding"></span> <span class="m-cgg m-cgg-icon--chevron-right ci-info-box__header-edit-icon"></span> </div><span class="ng-scope"> <div class="cgg-col-md-6 cgg-col-lg-6 cgg-col-sm-6 cgg-col-xs-6 text-left text-bold text-ellipsis ng-binding">'+locales[lang]['mortgageFees']+'</div><div class="cgg-col-md-6 cgg-col-lg-6 cgg-col-sm-6 cgg-col-xs-6 info_link_style" id="fp-mortgage-fees"> <span class="m-cgg m-cgg-icon--chevron-right pl-icon-style"></span>dummy value 3</div></span> </div><div class="cgg-row ng-scope"> <div class="cgg-col-md-12 ci-info-box__header ng-hide"> <span class="ci-info-box__header-text ng-binding"></span> <span class="m-cgg m-cgg-icon--chevron-right ci-info-box__header-edit-icon"></span> </div><span class="ng-scope"> <div class="cgg-col-md-6 cgg-col-lg-6 cgg-col-sm-6 cgg-col-xs-6 text-left text-bold text-ellipsis ng-binding" title="Coût total du projet">'+locales[lang]['totalCost']+'</div><div class="cgg-col-md-6 cgg-col-lg-6 cgg-col-sm-6 cgg-col-xs-6 info_link_style" id="fp-total-cost"> <span class="m-cgg m-cgg-icon--chevron-right pl-icon-style"></span>dummy value 4</div></span></div></div>');

//style (can be beautified if GTM is used)
var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '.radio-toolbar input[type=radio]{display:none}.radio-toolbar label{display:inline-block;padding:4px 11px;margin:0 10px 10px 0;cursor:pointer;width:95px;text-align:center;border:1px solid #77aa43}.radio-toolbar input[type=radio]:checked+label{background-color:#77aa43;color:#fff}';
document.getElementsByTagName('head')[0].appendChild(style);

// get data and compute
function computeFP() {
	formData = jQuery.parseJSON(sessionStorage.getItem('cggCore.formData'));
	registrationRights = 0.0110*formData["wantToBorrow"] + 150;
	mortgageOfficeFees = 0.0033*formData["wantToBorrow"] + ((formData["wantToBorrow"] < 272727) ? 220 : 950);
	notaryHonoraryMG = 1000; //FIXME: staircase on loanAmount;

	registrationFees = formData["propertyValue"]*regionalFees[$('input[name=region]:checked').val()];
	notaryFeesMax = VAT * (notaryHonorary + adminFeesMax) + mortgageOfficeTrans;
	mortgageFeesMax = VAT * (notaryHonoraryMG + adminFeesMGMax + 50) + registrationRights + mortgageOfficeFees +notaryHonorary + adminFeesMGMax;
}

// update the financial plan
function formatCurrency(num) {
	return '€ ' + num.toFixed(2).replace('.',',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
}
function writeFP(){
	computeFP();
	document.getElementById("fp-registration-fees").lastChild.nodeValue = formatCurrency(registrationFees);
	document.getElementById("fp-notary-fees").lastChild.nodeValue = formatCurrency(notaryFeesMax);	
	document.getElementById("fp-mortgage-fees").lastChild.nodeValue = formatCurrency(mortgageFeesMax);
	document.getElementById("fp-total-cost").lastChild.nodeValue = formatCurrency(parseFloat(formData["propertyValue"])+parseFloat(registrationFees)+parseFloat(notaryFeesMax)+parseFloat(mortgageFeesMax));
}
writeFP();


// listen to events in the form
//let list = document.getElementsByName("propertyValue");
//list[0].addEventListener("click", function() {console.log( $.now()); });
$('input[type=radio][name=region]').click(function() { writeFP(); }); 
$('input').blur(function() { writeFP(); }); 
//could be generalized with $('input').change(function() { writeFP(); }); 
