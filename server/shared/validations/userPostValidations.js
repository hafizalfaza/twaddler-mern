import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';


//User post server-side validation
export default function userPostValidations(data){
	let errors: {};
	
	if(Validator.isEmpty(data.inputText)){
		errors.inputText = "Oops, you didn't type anything yet";
	}else{
		if(data.inputText.length>140){
			errors.inputText = "Maximum character exceeded";
		}
	}	
	
	return {
		errors,
		isValid: isEmpty(errors)
	}
}