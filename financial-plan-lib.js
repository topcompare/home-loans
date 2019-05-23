/*
This library computes the total loan amount for a given property value.
Method: totalLoanAmount(property, funds, region, first)
Parameters:
property = value/price of the property
funds = own funds that can be brought to finance the project
region = either "brussels", "wallonia" or "flanders"
first = true/false whether it is the first and main property (it leads to regional discounts)

Example: console.log(FinancialPlan.totalLoanAmount(200000,50000,"brussels",true))

*/

var FinancialPlan = 
{
   totalLoanAmount: function(property, funds, region, first)
   {	
		// Define all the base variables
		var regionalFees = { brussels: 0.125, wallonia: 0.125, flanders: 0.1 };
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
		  firstProperty = first,
		  regionInfo;
		var ownFunds = funds,
		  propertyValue = property;

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

		// Compute regional discounts
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
		registrationFees = Math.max(regionalFees[region] * ( (propertyValue-discountValue) - regionalDeduction ) + 0.06 * Math.min(discountValue, propertyValue),0);
		} else{
		  registrationFees = (propertyValue - regionalDeduction) * regionalFees[region];
		}

		// Compute the amounts
		notaryFixedFee = notaryMatrix[getStaircaseRow(notaryMatrix, propertyValue)][notaryFixedRateCol] * VAT + notaryFixedCost;
		notaryVariablePercentage = notaryMatrix[getStaircaseRow(notaryMatrix, propertyValue)][notaryPercentageCol] * VAT;

		notaryFeesMax = propertyValue * notaryVariablePercentage + notaryFixedFee;

		totalAmount = propertyValue + notaryFeesMax + registrationFees - ownFunds;
		mortgageFeesMax = mortgageMatrix[getStaircaseRow(mortgageMatrix, totalAmount)][mortgagePercentageCol] * totalAmount + mortgageMatrix[getStaircaseRow(mortgageMatrix, totalAmount)][mortgageFixedRateCol] - totalAmount;
		
		// Return total loan amount
		return Math.max(propertyValue + parseFloat(registrationFees) + parseFloat(notaryFeesMax) + parseFloat(mortgageFeesMax) - ownFunds, 0);  
   }
};
