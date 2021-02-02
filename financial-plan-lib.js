/*
This library computes the total loan amount for a given property value.
Method: totalLoanAmount(property, funds, region, first)
Parameters:
property = value/price of the property
funds = own funds that can be brought to finance the project
region = either "brussels", "wallonia" or "flanders"
firstProperty = true/false whether it is the first and main property (it leads to regional discounts)

Example: console.log(FinancialPlan.totalLoanAmount(200000,50000,"brussels",true))

Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects

*/

var FinancialPlan = {
  	// Default user values of the simulation. To be overriden with custom values: FinancialPlan.variableName = value
	propertyValue: 200000,
	newProperty: false, // If the property is new (< 2 years), it falls under the VAT regime. Otherwise, registration costs apply (reference: https://www.notaire.be/acheter-louer-emprunter/ventes-soumises-a-la-tva)
	firstProperty: true, // Whether one can benefit from the first time buy and owner occupied discount
	region: "brussels", // Can take either "brussels", "wallonia" or "brussels"
	walloniaDiscount: false, // Whether the 'reduced rate' for modest housing is applicable (reference: https://www.notaire.be/acheter-louer-emprunter/1-droits-d-enregistrement/en-region-wallonne-3/taux-reduit-en-cas-d-habitation-modeste)
	ownFunds: 50000, // Own funds one can bring
	durationYears: 20,
	income: 2000, // All net monthly income one has
	charges: 0, // All total monthly credit charges one has (without the future mortgage charges, and of course excluding household charges)
	annualRate: 0.033, // Assumption of the annual interest rate used for all calculations
	// binds the monthly rate property to a function of the annual rate. Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get
	get monthlyRate() { return (1+this.annualRate)**(1/12)-1 },
  
   	// Setting lending assumptions
	maxDebtRatio: 0.45, // Debt ratio can be max 45% (dixit HypoConnect, otherwise 1/3 to be more conservative), of the net available income
    maxDurationYears: 30, // Sets the maximum duration allowed (typically, it is more 25 years nowadays)
   	NAI: 1000, // the net available income must be at least 1000€ (1200€ with co-applicant)
  
	// Setting constants
	regionalFees: { brussels: 0.125, wallonia: 0.125, flanders: 0.1 }, //obsolete (defined in function)
	notaryFixedCost: 2178,
	discountValue: 160353, //obsolete (defined in function)
	VAT: 0.21,
	notaryMatrix: [ // header: value, notaryPercentageCol, notaryFixedRateCol
		[0, 0.0456, 0],
		[7500, 0.0285, 128.25],
		[17500, 0.0228, 228],
		[30000, 0.0171, 399],
		[45495, 0.0114, 658.3215],
		[64095, 0.0057, 1023.663],
		[250095, 0.00057, 2306.65035]
	],
	mortgageMatrix: [ // header: value, mortgagePercentageCol, mortgageFixedRateCol
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
	],
  
    // Declaring the variables used 
	monthlyPayment: 0,
	notaryFixedFees: 0,
	notaryVariableFees: 0,
	notaryTotalFees: 0,
	registrationInitialFees: 0,
	registrationFeesDiscount: 0,
	registrationDiscountedFees: 0,
	totalAcquisitionCost: 0,
	loanAmount: 150000,
	mortgageFixedFees: 0,
	mortgageVariableFees: 0,
	mortgageTotalFees: 0,
	totalAmountWithMortgage: 0,
	repaymentSchedule: [],
  
	// Auxiliary function to navigate the matrices
	getStaircaseRow: function (matrix, value) {
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
	},
  
    /**
    * Determines the monthly payment given a loan amount, the interest rate and the number of payment periods
    * @param {Number} ir   - interest rate per month
    * @param {Number} np   - number of periods (months)
    * @param {Number} pv   - present value
    * @param {Number} fv   - future value
    * @param {Boolean} type - when the payments are due:
    *        0: end of the period, e.g. end of month (default)
    *        1: beginning of period
    * @return {Number} The value of the PMT (not rounded)
    */
    getPMT: function(ir = this.monthlyRate, np = this.durationYears * 12, pv = -this.loanAmount, fv = 0, type = 0) {
       var pmt, pvif;

       fv || (fv = 0);
       type || (type = 0);

       if (ir === 0)
           return -(pv + fv) / np;

       pvif = Math.pow(1 + ir, np);
       pmt = -ir * pv * (pvif + fv) / (pvif - 1);

       if (type === 1)
           pmt /= (1 + ir);

       return pmt;
    },

	// Methods reversed engineered from HypoConnect
	calcNotaryFeesHC() {
		let notaryVariablePercentage = this.notaryMatrix[this.getStaircaseRow(this.notaryMatrix, this.propertyValue)][1] * (1 + this.VAT);
		this.notaryFixedFees = this.notaryMatrix[this.getStaircaseRow(this.notaryMatrix, this.propertyValue)][2] * (1 + this.VAT) + this.notaryFixedCost;
		this.notaryVariableFees = notaryVariablePercentage * this.propertyValue;
		this.notaryTotalFees = this.notaryFixedFees + this.notaryVariableFees;
	},

	calcRegistrationFeesHC() {
		let regionalDeduction = 0;
		if (this.region == "brussels" && this.firstProperty && this.propertyValue <= 500000) {
			regionalDeduction = Math.min(this.propertyValue, 175000);
		} else if (this.region == "flanders" && this.firstProperty && this.propertyValue <= 200000) {
			regionalDeduction = Math.min(this.propertyValue, 80000);
		} else if (this.region == "wallonia" && this.firstProperty) {
			regionalDeduction = Math.min(this.propertyValue, 20000);
		}
        // Determine the registration fee. This is the main output of the function.
		this.registrationInitialFees = this.propertyValue * this.regionalFees[this.region];
		if (this.region == "flanders" && this.firstProperty) {
			this.registrationDiscountedFees = (this.propertyValue - regionalDeduction) * 0.06;
		} else if (this.region == "wallonia" && this.walloniaDiscount) {
			this.registrationDiscountedFees = Math.min(this.propertyValue - regionalDeduction, this.discountValue) * 0.06 + Math.max(this.propertyValue - regionalDeduction - this.discountValue, 0) * this.regionalFees[this.region];
		} else {
			this.registrationDiscountedFees = (this.propertyValue - regionalDeduction) * this.regionalFees[this.region];
		}
        // For detailed breakdown, determine the registration discount by difference
		this.registrationFeesDiscount = this.registrationInitialFees - this.registrationDiscountedFees;
    },
  
  	calcMortgageFeesHC() {
        // Determine mortgage fees (varies with the loan amount)
        this.loanAmount = this.propertyValue + this.notaryTotalFees + this.registrationDiscountedFees - this.ownFunds;
		this.mortgageFixedFees = this.mortgageMatrix[this.getStaircaseRow(this.mortgageMatrix, this.loanAmount)][2];
		this.mortgageVariableFees = this.mortgageMatrix[this.getStaircaseRow(this.mortgageMatrix, this.loanAmount)][1] * this.loanAmount - this.loanAmount;
		this.mortgageTotalFees = this.mortgageFixedFees + this.mortgageVariableFees;
	},
    
    // Methods defined by TopCompare
  	calcPurchaseDeedFees() {
      // NOTE: These variable names are more appropriate and self-explanatory. Keep the original ones for backwards compatibility
      let uniqueHome = this.firstProperty;
      let propertyPrice = this.propertyValue;

      let taxBase = propertyPrice;
      let registrationFee = 0;
      // Determine abatement
      if (this.region == "brussels" && uniqueHome && this.propertyValue <= 500000) {
          // Reference: https://www.notaire.be/acheter-louer-emprunter/1-droits-d-enregistrement/en-region-bruxelloise-1/abattement-des-droits-d-enregistrement-a-bruxelles
          taxBase -= Math.min(this.propertyValue, 175000);
		} else if (this.region == "flanders" && uniqueHome && this.propertyValue <= 200000) {
          // Reference: https://www.notaris.be/verkopen-kopen-huren-lenen/kopen-en-verkopen-1/registratiebelasting-in-het-vlaams-gewest-1/abattement
          taxBase -= Math.min(this.propertyValue, 80000);
		} else if (this.region == "wallonia" && uniqueHome) {
          // Reference: https://www.notaire.be/acheter-louer-emprunter/droits-d-enregistrement/en-region-wallonne-3/abattement-en-cas-dhabitation-unique
          taxBase -= Math.min(this.propertyValue, 20000);
      }
      
      // Determine amount subject to reduced tax rate
      if (this.region == "wallonia" && this.walloniaDiscount) {
        // Reference: https://www.notaire.be/acheter-louer-emprunter/1-droits-d-enregistrement/en-region-wallonne-3/taux-reduit-en-cas-d-habitation-modeste
        let tranche;
        // NOTE: the amount is dependent on the urban zone. Until this feature is implemented, we default to the lower amount
        if (true) {
           // Outside pressure zone (default)
           tranche = 163125.56; // amount indexed on 01/01/2020
        } else {
           // Inside pressure zone: Arlon, Assesse, Aubel, Beauvechain, Braine-l'Alleud, Braine-le-Château, Burdinne, Chastre, Chaumont-Gistoux, Court-Saint-Etienne, Flobecq, Geer, Genappe, Gesves, Grez-Doiceau, Incourt, Ittre, Jalhay, Jodoigne, La Bruyère, La Hulpe, Lasne, Mont-Saint-Guibert, Nivelles, Ottignies-Louvain-la-Neuve, Perwez (Nivelles), Ramillies, Rixensart, Silly, Sprimont, Thimister-Clermont, Tubize, Villers-la-Ville, Walhain, Waterloo and Wavre
           tranche = 174000.61; // amount indexed on 01/01/2020   
        }
        registrationFee += (Math.min(tranche,taxBase) * 0.06); 
        taxBase -= Math.min(tranche,taxBase);
      }  
      
      // Determine registration fee
      if (this.region == "brussels") {
          // Reference: https://www.notaire.be/acheter-louer-emprunter/droits-d-enregistrement/en-region-bruxelloise-1
          registrationFee += taxBase * 0.125;
      } else if (this.region == "flanders" ) {
          // Reference: https://www.notaris.be/verkopen-kopen-huren-lenen/kopen-en-verkopen-1/registratiebelasting-in-het-vlaams-gewest-1
          if (uniqueHome) {
            registrationFee += taxBase * 0.06;
          } else {
            registrationFee += taxBase * 0.10;
          }
      } else if (this.region == "wallonia") {
          // Reference: https://www.notaire.be/acheter-louer-emprunter/droits-d-enregistrement/en-region-wallonne-3/abattement-en-cas-dhabitation-unique
          registrationFee += taxBase * 0.125;
      }

      // Determine notary fee
      var notaryMatrix = [ // header: bracket, fee percentage, cumulative fee
		[0, 0.0456, 0],
		[7500, 0.0285, 342.00],
		[17500, 0.0228, 627.00],
		[30000, 0.0171, 912.00],
		[45495, 0.0114, 1176.9645],
		[64095, 0.0057, 1389.0045],
		[250095, 0.00057, 2449.2045]
      ];
      let stepPercent = notaryMatrix[this.getStaircaseRow(notaryMatrix, propertyPrice)][1];
      let stepAmount = propertyPrice - notaryMatrix[this.getStaircaseRow(notaryMatrix, propertyPrice)][0];
      let stepCumulative = notaryMatrix[this.getStaircaseRow(notaryMatrix, propertyPrice)][2];
      let notaryFee = Math.round((stepPercent * stepAmount + stepCumulative + Number.EPSILON) * 100) / 100;     
         
      // Add administrative fees
      let administrativeFee = Math.max(800.00,1100.00);
      
      // Apply VAT
      let VAT = Math.round(((notaryFee + administrativeFee) * 0.21 + Number.EPSILON) * 100) / 100;
      
      // Mortgage transcription 
      let transcription = 230.00;
  
      // Return object with the total purchase deed fee and its breakdown
      return {
        amount: Math.round((registrationFee + notaryFee + administrativeFee + VAT + transcription + Number.EPSILON) * 100) / 100,
        localeFR: "Frais de notaire d’acte d’achat",
        localeNL: "Aankoopkosten",
  
        registrationFee: {
          amount: Math.round((registrationFee + Number.EPSILON) * 100) / 100,
          localeFR: "Frais d’enregistrement",
          localeNL: "Registratiebelasting/rechten"
        },
        notaryFee: {
          amount: notaryFee,
          localeFR: "Honoraires",
          localeNL: "Ereloon"
        },
        administrativeFee: {
          amount: administrativeFee,
          localeFR: "Frais administratifs",
          localeNL: "Administratieve kosten"
        },
        transcription: {
          amount: transcription,
          localeFR: "Transcription hypothécaire",
          localeNL: "Kosten overschrijving"
        },
        vat: {
          amount: VAT,
          localeFR: "TVA",
          localeNL: "BTW"
        }
      };
      
    },

  	calcMortgageDeedFees(/*number*/ principal = this.loanAmount) {
      // The mortgage deed fees are variable with the total loan amount. The total loan amount is composed of the mortgage loan plus mortgage accessories, which is usually 10% of the mortgage loan. It covers registration supplements taken by the bank to cover the costs not covered by the main registration
      let loanAmount = principal * (1 + 0.1);
      
      // Mortgage registration rights
      var registrationTax = 0.01 ; // 10% of total loan amount 
      var appendixRight = 100; // fixed amount in EUR
      var writingRight = 50; // fixed amount in EUR
      // Mortgage office fees
      var mortgageRegistrationRight = 0.003;
      var retribution = (loanAmount < 300000) ? 230.00 : 950.00;
 
      // Determine notary fee
      /* The matrix values can be obtained from notaires.be and their javascript asset: https://calculate.notaris.be/static/js/main.03d69eda.js
            var e = 1.71 * Math.min(t, 7500) / 100;
            return t > 7500 && (e += 1.368 * (Math.min(t, 17500) - 7500) / 100), t > 17500 && (e += .912 * (Math.min(t, 3e4) - 17500) / 100), t > 3e4 && (e += .684 * (Math.min(t, 45495) - 3e4) / 100), t > 45495 && (e += .456 * (Math.min(t, 64095) - 45495) / 100), t > 64095 && (e += .228 * (Math.min(t, 250095) - 64095) / 100), t > 250095 && (e += .0456 * (t - 250095) / 100), e = Math.max(e, 8.55), parseInt(100 * (e + .005), 10) / 100
      */
      var notaryMatrix = [ // header: bracket, fee percentage, cumulative fee
		[0, 0.0171, 0],
		[7500, 0.01368, 128.2500],
		[17500, 0.00912, 265.0500],
		[30000, 0.00684, 379.0500],
		[45495, 0.00456, 485.0358],
		[64095, 0.00228, 569.8518],
		[250095, 0.000456, 993.9318] 
      ];
      let stepPercent = notaryMatrix[this.getStaircaseRow(notaryMatrix, loanAmount)][1];
      let stepAmount = loanAmount - notaryMatrix[this.getStaircaseRow(notaryMatrix, loanAmount)][0];
      let stepCumulative = notaryMatrix[this.getStaircaseRow(notaryMatrix, loanAmount)][2];
      let notaryFee = Math.round((stepPercent * stepAmount + stepCumulative + Number.EPSILON) * 100) / 100;
      
      // Add administrative fees
      let administrativeFee = Math.max(700.00,1000.00);    

      // Apply VAT
      let VAT = Math.round(((notaryFee + administrativeFee + writingRight) * 0.21 + Number.EPSILON) * 100) / 100;
 
      // Return object with the total mortgage deed fee and its breakdown
      return {
        amount: Math.round((registrationTax*loanAmount + appendixRight + writingRight + mortgageRegistrationRight*loanAmount + retribution + notaryFee + administrativeFee + VAT + Number.EPSILON) * 100) / 100,
        localeFR: "Frais d’acte de crédit hypothécaire",
        localeNL: "Kosten voor standaardkrediet",
  
        registrationTax: {
          amount: Math.round((registrationTax*loanAmount + Number.EPSILON) * 100) / 100,
          localeFR: "Droits d’enregistrement",
          localeNL: "Registratiebelasting/rechten"
        },
        appendixRight: {
          amount: appendixRight,
          localeFR: "Droit pour les annexes",
          localeNL: "Forfait registratie bijlage(n)"
        },
        writingRight: {
          amount: writingRight,
          localeFR: "Droit d'écriture",
          localeNL: "Recht op geschriften"
        },
        mortgageRegistrationRight: {
          amount: Math.round((mortgageRegistrationRight*loanAmount + Number.EPSILON) * 100) / 100,
          localeFR: "Frais d'hypothèque - Droit d'hypothèque",
          localeNL: "Hypotheekkosten - Hypotheekrecht"
        },
        retribution: {
          amount: retribution,
          localeFR: "Frais d'hypothèque - Rétribution",
          localeNL: "Hypotheekkosten - Retributie"
        },        
        notaryFee: {
          amount: notaryFee,
          localeFR: "Honoraires",
          localeNL: "Ereloon"
        },        
        administrativeFee: {
          amount: administrativeFee,
          localeFR: "Frais administratifs",
          localeNL: "Administratieve kosten"
        },        
        VAT: {
          amount: VAT,
          localeFR: "TVA",
          localeNL: "BTW"
        }
      };
      
	},
  
    /**
    * Determines the repayment over time, in months. This allows to build a monthly amortization table and to plot charts (as the monthly data provides more granularity)
    * @return {Array}      Every item in the array contains for a given month the following elements. The length is the loan tenure in months (years *12)
    * @return {Array}.payment              the monthly payment, as determined by getPMT() 
    * @return {Array}.principalPayment     the principal payment, i.e. the principal reimbursement component of the monthly payment
    * @return {Array}.principalCumulative  the running sum of all principal payments 
    * @return {Array}.interestPayment      th monthly interest payment, i.e. the interest component of the monthly payment
    * @return {Array}.interestCumulative   the running sum of all interest payments
    * @return {Array}.balance              the outstanding balance, i.e. the total initial loan amount minus the downpayments over time 
    */
	getScheduleMonthly() {
		this.monthlyPayment = Math.round((this.getPMT() + Number.EPSILON) * 100) / 100;
		let schedule = [];
		let periods = (12*this.durationYears);
		schedule[0] = {
			payment: 0,
			principalPayment: 0,
            principalCumulative: 0,
			interestPayment: 0,
            interestCumulative: 0,
			balance: this.loanAmount
		};
		for (let i = 1; i <= periods; i++) {
            let interest = Math.round((schedule[i - 1].balance * this.monthlyRate + Number.EPSILON) * 100) / 100;
            // Monthly payment is either the monthly installment (determined by getPMT()) or the remaining balance at the end of the term
            let payment = (i == periods) ? Math.round((schedule[i - 1].balance*(1+this.monthlyRate) + Number.EPSILON) * 100) / 100 : this.monthlyPayment;
            let principal = Math.round((payment - interest + Number.EPSILON) * 100) / 100;
			schedule[i] = {
				payment: payment,
				principalPayment: principal,
                principalCumulative: Math.round((schedule[i-1].principalCumulative + principal + Number.EPSILON) * 100) / 100,
				interestPayment: interest,
                interestCumulative: Math.round((schedule[i-1].interestCumulative + interest + Number.EPSILON) * 100) / 100,
				balance: Math.round((schedule[i - 1].balance - principal + Number.EPSILON) * 100) / 100
			};
		}
		this.repaymentSchedule = schedule;
        return schedule;
	},

    /**
    * Same as getScheduleMonthly but aggregated on a yearly basisDetermines the repayment over time, in months. This allows to build a monthly amortization table and to plot charts (as the monthly data provides more granularity)
    * @return {Object}      Every element contains an array contains with all the data per year
    * @return {Object}.principal {Array}    cumulative principal reimbursement for each year 
    * @return {Object}.interest {Array}     cumulative interest payments for each year 
    * @return {Object}.balance {Array}      the outstanding balance per year 
    */
	getScheduleYearly() {
        let scheduleMonthly = this.getScheduleMonthly() || [];
        let schedule = [];
        schedule[0] = {
            balance: scheduleMonthly[0].balance,
            interest: 0,
            principal: 0
        };
        for (let i = 1; i <= scheduleMonthly.length; i++) {
          if (i % 12 === 0 && i !== 0) {
            schedule[ i / 12] = {
              interest : scheduleMonthly[i].interestCumulative,
              principal : scheduleMonthly[i].principalCumulative,
              balance : scheduleMonthly[i].balance
            }
          } 
        }
        return schedule;
	},
  

	/**
	* Determine the total project cost without taking into account the funding (own funds and the loan) and given the property value, the region, the first buy and reduced rate for Wallonia (not passed as parameters but read from the object variables).
	* In order to retrieve the components of that sum, you can read the variables that have been set along the way:
	* - Registration rights: FinancialPlan.registrationDiscountedFees
	* - Notary fees: FinancialPlan.notaryTotalFees
	* - Mortgage fees: FinancialPlan.mortgageTotalFees
	* - Property value: FinancialPlan.propertyValue
	* @param  {Boolean}     regimeVAT Optional: Set the tax regime (true for VAT, false for registration fees) instead of using the default value
	* @return {Number}      The total project cost
	*/
	getAcquisitionCost(/*boolean*/ regimeVAT = undefined) {
		// if the tax regime has been set (to true, for instance), use it instead of the default value of newProperty
		if (regimeVAT != undefined) {
			this.newProperty = regimeVAT;
		}
		
		// convert NaN (or empty string in this case) to 0 (source: https://stackoverflow.com/questions/7540397/convert-nan-to-0-in-javascript)
		this.ownFunds = this.ownFunds || 0;

      	// Run all the calculations - DEPRECATED (HypoConnect methods are replaced with TopCompare methods)
		//this.calcRegistrationFeesHC(); // Note: only relevant if purchase is not under VAT regime
		//this.calcNotaryFeesHC();
		//this.calcMortgageFeesHC();
		let purchaseDeedFees = this.calcPurchaseDeedFees().amount;
		
		// the mortgage deed fees are depending on the loan amount, the variable we are trying to determine through this function (it is a loop function). We can approximate it by determining the loan amount needed before covering the mortgage deed costs (TODO: and then inflate it by an estimated mortgage deed cost)
		let mortgageDeedFees = this.calcMortgageDeedFees(this.propertyValue + purchaseDeedFees - this.ownFunds).amount;

		// Make the sum for the total project cost, depending on the tax regime
		if (this.newProperty) {
				this.totalAmountWithMortgage = this.propertyValue + purchaseDeedFees + mortgageDeedFees + this.propertyValue * this.VAT;
			} else {
				this.totalAmountWithMortgage = this.propertyValue + purchaseDeedFees + mortgageDeedFees;
			}
		// Use rounding to ensure things like 1.005 round correctly
		return Math.round((this.totalAmountWithMortgage + Number.EPSILON) * 100) / 100 ;
	},

	/**
	* Determine the maximum loan amount given revenues and charges. It assumes conservative debt ratio
	* @param  {Number}     arbitraryMonthlyPayment Optional: Set the monthly installment instead of using the maximum value given the allowed debt ratio
	* @return {array}      The maximum loan amount for each duration (0 to 30 years)
	*/
	getMaxLoan(/*number*/ arbitraryMonthlyPayment = undefined) {
		// if a monthly installment has been set, use it instead of the one deducted from the revenue and debt ratio
		if (arbitraryMonthlyPayment != undefined) {
			this.monthlyPayment = arbitraryMonthlyPayment;
		} else {
			this.monthlyPayment = Math.max(Math.min(this.income * this.maxDebtRatio - this.charges, this.income - this.NAI),0);
		}		

		// compute the maximum loan amount for the different durations (from 0 years to 30) and store it in an array
		let result = [];
		for (let years = 0; years < this.maxDurationYears; years++) {
			// the remaining net available income needs to be above a certain threshold to be eligibile for a loan. Otherwise, return 0
			if (this.income - this.charges - this.monthlyPayment < this.NAI) {
				result[years] = 0;
			} else {
				// Reference: http://www.iotafinance.com/en/Formula-Maximum-Loan-Amount.html
				// Interesting article by CAG: https://www.comparehero.my/personal-loan/articles/maximum-loan-amount-calculated
				let principal = this.monthlyPayment / (this.monthlyRate / (1 - (1 + this.monthlyRate) ** (-12 * years)));
				// Round to nearest hundred before returning the array
				result[years] = Math.round(principal/100)*100;
			}
		}
       		 // Update the global variable for other functions to use the latest value (e.g. the amortization schedule)
        	this.loanAmount = result[this.durationYears - 1];
		return result;
	},

	/**
	* Determine the maximum value of the property given the borrowing capacity
	* @return {array}      The maximum property value for each duration (0 to n years)
	*/
	getMaxProperty() {
	let result = [];
	// The borrowing capacity is a hard constraint. Retrieve it for the given profile (revenue, ...)
	let maxLoanAmount = this.getMaxLoan();
	// We will determine the property price by goal seeking, i.e. by increasing the price by increments while testing against the maximum possible
	let increment = 1000;
	this.propertyValue = 0;

	// As the result depends on the duration, we create an array for every year
	for (let years = 0; years < this.maxDurationYears; years++) {
		// For as long as the loan needed to fund that property (given the own funds available) is within borrowing capacity, increment the property price
		while (this.getAcquisitionCost() - this.ownFunds < maxLoanAmount[years]) {
			this.propertyValue += increment;
		}
		result[years] = this.propertyValue;
	}	
		
	return result;
	}
	
};
