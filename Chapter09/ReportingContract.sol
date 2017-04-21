contract ReportingContract {
	address[] public validators = [0x831647ec69be4ca44ea4bd1b9909debfbaaef55c, 0x12a6bda0d5f58538167b2efce5519e316863f9fd];
	mapping(address => uint) indices;
	address public disliked;
	
	function ReportingContract() {
	    for (uint i = 0; i < validators.length; i++) {
	        indices[validators[i]] = i;
	    }
	}
    
	// Called on every block to update node validator list.
    function getValidators() constant returns (address[]) {
		return validators;
	}
 
	// Expand the list of validators.
	function addValidator(address validator) {
		validators.push(validator);
	}

	// Remove a validator from the list.
	function reportMalicious(address validator) {
		validators[indices[validator]] = validators[validators.length-1];
		delete indices[validator];
		delete validators[validators.length-1];
		validators.length--;
	}
	
	function reportBenign(address validator) {
	    disliked = validator;
	}
}