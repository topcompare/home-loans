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
	// Constants related to the market
	regionalFees: { brussels: 0.125, wallonia: 0.125, flanders: 0.1 },
	notaryFixedCost: 2178,
	discountValue: 160353,
	VAT: 1.21,
	notaryMatrix: [
		[0, 0.0456, 0],
		[7500, 0.0285, 128.25],
		[17500, 0.0228, 228],
		[30000, 0.0171, 399],
		[45495, 0.0114, 658.3215],
		[64095, 0.0057, 1023.663],
		[250095, 0.00057, 2306.65035]
	],
	mortgageMatrix: [
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
	notaryPercentageCol: 1,
	notaryFixedRateCol: 2,
	mortgagePercentageCol: 1,
	mortgageFixedRateCol: 2,

	// Default parameters of the simulation. To be overriden with custom values: FinancialPlan.variableName = value
	propertyValue: 200000,
	region: "brussels",
	firstProperty: true,
	walloniaDiscount: false,
	ownFunds: 100000,
	durationYears: 20,
	income: 5000,
	charges: 0,
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
	annualRate: 0.033,
	//  binds the monthly rate property to a function of the annual rate. Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get
	get monthlyRate() { return (1+this.annualRate)**(1/12)-1 },
  
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
    getPMT: function(ir = this.monthlyRate, np = this.durationYears * 12, pv = this.loanAmount, fv = 0, type = 0) {

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

	// Methods used for simulations
	calcNotaryFees() {
		let notaryVariablePercentage = this.notaryMatrix[this.getStaircaseRow(this.notaryMatrix, this.propertyValue)][this.notaryPercentageCol] * this.VAT;
		this.notaryFixedFees = this.notaryMatrix[this.getStaircaseRow(this.notaryMatrix, this.propertyValue)][this.notaryFixedRateCol] * this.VAT + this.notaryFixedCost;
		this.notaryVariableFees = notaryVariablePercentage * this.propertyValue;
		this.notaryTotalFees = this.notaryFixedFees + this.notaryVariableFees;
		this.totalAcquisitionCost += this.notaryTotalFees;
	},

	calcRegistrationFees() {
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
			this.registrationDiscountedFees = (this.propertyValue - regionalDeduction) * 0.07;
		} else if (this.region == "wallonia" && this.walloniaDiscount) {
			this.registrationDiscountedFees = Math.min(this.propertyValue - regionalDeduction, this.discountValue) * 0.06 + Math.max(this.propertyValue - regionalDeduction - this.discountValue, 0) * this.regionalFees[this.region];
		} else {
			this.registrationDiscountedFees = (this.propertyValue - regionalDeduction) * this.regionalFees[this.region];
		}
        // For detailed breakdown, determine the registration discount by difference
		this.registrationFeesDiscount = this.registrationInitialFees - this.registrationDiscountedFees;
        // For the total, set the total acqusition cost
        this.totalAcquisitionCost += this.registrationDiscountedFees;
    },

	calcMortgageFees() {
        // Determine mortgage fees (varies with the loan amount)
        this.loanAmount = this.propertyValue + this.notaryTotalFees + this.registrationDiscountedFees - this.ownFunds;
		this.mortgageFixedFees = this.mortgageMatrix[this.getStaircaseRow(this.mortgageMatrix, this.loanAmount)][this.mortgageFixedRateCol];
		this.mortgageVariableFees = this.mortgageMatrix[this.getStaircaseRow(this.mortgageMatrix, this.loanAmount)][this.mortgagePercentageCol] * this.loanAmount - this.loanAmount;
		this.mortgageTotalFees = this.mortgageFixedFees + this.mortgageVariableFees;
		// Make the sum for the total project cost
        this.totalAmountWithMortgage = this.totalAcquisitionCost + this.mortgageTotalFees;
	},
  
	calcSchedule() {
		this.monthlyPayment = Math.round((-this.getPMT() + Number.EPSILON) * 100) / 100;
		let schedule = [];
		schedule.length = (12*this.durationYears);
		schedule[0] = {
			payment: this.monthlyPayment,
			principal: this.monthlyPayment - Math.round((this.loanAmount * this.monthlyRate + Number.EPSILON) * 100) / 100,
			interest: Math.round((this.loanAmount * this.monthlyRate + Number.EPSILON) * 100) / 100,
			balance: this.loanAmount - (this.monthlyPayment - Math.round((this.loanAmount * this.monthlyRate + Number.EPSILON) * 100) / 100)
		};
		for (let i = 1; i < (12 * this.durationYears); i++) {
            let interest = Math.round((schedule[i - 1].balance * this.monthlyRate + Number.EPSILON) * 100) / 100;
            let payment = Math.round(Math.min(this.monthlyPayment,schedule[i - 1].balance*(1+this.monthlyRate) + Number.EPSILON) * 100) / 100;
            let principal = Math.round((payment - interest + Number.EPSILON) * 100) / 100;
			schedule[i] = {
				payment: payment,
				principal: principal,
				interest: interest,
				balance: Math.round((schedule[i - 1].balance - principal + Number.EPSILON) * 100) / 100
			};
		}
		this.repaymentSchedule = schedule;
        return schedule;
	},

    getCumulativeRepayment() {
        // make sure the repayment schedule is calcuated
        this.calcSchedule();
      	let schedule = [];
		schedule.length = (12*this.durationYears);
      		schedule[0] = {
			outstanding: Math.round((this.loanAmount - this.repaymentSchedule[0].principal + Number.EPSILON) * 100) / 100,
			principal: Math.round((this.repaymentSchedule[0].principal + Number.EPSILON) * 100) / 100,
			interest: Math.round((this.repaymentSchedule[0].interest + Number.EPSILON) * 100) / 100
		};
		for (let i = 1; i < (12 * this.durationYears); i++) {
			schedule[i] = {
				outstanding: schedule[i-1].outstanding - Math.round((this.repaymentSchedule[i].principal + Number.EPSILON) * 100) / 100,
				principal: schedule[i-1].principal + Math.round((this.repaymentSchedule[i].principal + Number.EPSILON) * 100) / 100,
				interest: schedule[i-1].interest + Math.round((this.repaymentSchedule[i].interest + Number.EPSILON) * 100) / 100
			};
		}
      return schedule;
    },

    /**
    * Determine the total project cost
    * @return {Number}      The maximum loan amount for each duration (0 to 30 years)
    */
	getAcquisitionCost() {
		// Default own funds to 20% of property value if unset
		if (this.ownFunds == undefined) {
			this.ownFunds = 0.2 * this.propertyValue;
		}

		this.totalAcquisitionCost = this.propertyValue;
		this.calcRegistrationFees();
		this.calcNotaryFees();
		this.calcMortgageFees();
		this.calcSchedule();
		
        // Use rounding to ensure things like 1.005 round correctly
		return Math.round((this.totalAmountWithMortgage + Number.EPSILON) * 100) / 100 ;
	},

    /**
    * Determine the maximum loan amount given revenues and charges. It assumes conservative debt ratio
    * @param  {Number} arbitraryMonthlyPayment Optional: Set the monthly installment instead of using the maximum value given the allowed debt ratio
    * @return {array}      The maximum loan amount for each duration (0 to 30 years)
    */
	getMaxLoan(/*number*/ arbitraryMonthlyPayment = undefined) {
		// assumptions: debt ratio can be max 45% (dixit HypoConnect, otherwise 1/3 to be more conservative), of the net available income
		let maxDebtRatio = 0.45;

		// if a monthly installment has been set, use it instead of the one deducted from the revenue and debt ratio
		if (arbitraryMonthlyPayment != undefined) {
			this.monthlyPayment = arbitraryMonthlyPayment;
		} else {
			this.monthlyPayment = this.income * maxDebtRatio - this.charges;
		}		

		// compute the maximum loan amount for the different durations (from 0 years to 30) and store it in an array
		let result = [];
		for (let years = 0; years < 31; years++) {
			// the NAI must be at least 1000€ (1200€ with co-applicant) to be eligibile for a loan. Otherwise, return 0
			if (this.income - this.charges - this.monthlyPayment < 1000) {
				result[years] = 0;
			} else {
				// Reference: http://www.iotafinance.com/en/Formula-Maximum-Loan-Amount.html
				// Interesting article by CAG: https://www.comparehero.my/personal-loan/articles/maximum-loan-amount-calculated
				let principal = this.monthlyPayment / (this.monthlyRate / (1 - (1 + this.monthlyRate) ** (-12 * years)));
				// Round to nearest hundred before returning the array
				result[years] = Math.round(principal/100)*100;
			}
		}
		return result;
	},

    /**
    * Determine the maximum value of the property given the borrowing capacity
    * @return {array}      The maximum property value for each duration (0 to 30 years)
    */
	getMaxProperty() {
		this.propertyValue = 0;
		let result = [];
		let maxLoanAmount = this.getMaxLoan();
		for (let years = 0; years < 31; years++) {
			this.getAcquisitionCost();
			while (this.loanAmount < maxLoanAmount[years]) {
				this.propertyValue += 1000;
				this.getAcquisitionCost();
			}
			result[years] = this.propertyValue;
		}
		return result;
	}
};
