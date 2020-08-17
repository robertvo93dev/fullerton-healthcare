import { Validator } from "../class/validator";

export class QuestionBase<T> {
	value?: T;
	key: string;
	label: string;
	required: boolean;
	order: number;
	controlType: string;
	type: string;
	options: { key: string, value: string }[];
	validators: {[s:string]: Validator<any>};
	multiple: boolean;    //dropdown list multiple
	rows: number;       //number of rows in text area
	readonly: boolean;  //question is readonly or not
	searchBar: boolean;
	serverUrl: string;
	displayField: string;
	listFields: string[];
	filterCondition: string;

	constructor(options: {
		value?: T,
		key?: string,
		label?: string,
		required?: boolean,
		order?: number,
		controlType?: string,
		type?: string,
		options?: { key: string, value: string }[],
		validators?: any,
		multiple?: boolean,
		rows?: number,
		readonly?: boolean,
		searchBar?: boolean,
		serverUrl?: string,
		displayField?: string,
		listFields?: string[],
		filterCondition?: string
	} = {}) {
		this.value = options.value;
		this.key = options.key || '';
		this.label = options.label || '';
		this.required = !!options.required;
		this.order = options.order === undefined ? 1 : options.order;
		this.controlType = options.controlType || '';
		this.type = options.type || '';
		this.options = options.options || [];
		this.validators = options.validators || [];
		this.multiple = !!options.multiple;
		this.rows = options.rows === undefined ? 1 : options.rows;
		this.readonly = !!options.readonly;
		this.searchBar = !!options.searchBar;
		this.serverUrl = options.serverUrl || '';
		this.displayField = options.displayField || '';
		this.listFields = options.listFields || [];
		this.filterCondition = options.filterCondition || '';
	}
}
