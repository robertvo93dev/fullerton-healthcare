
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { Config } from "../configuration/config";
import { EventType } from "../class/eventType";
import { commonAPI } from "./common-api.service";
import { apiConfig } from "../configuration/api.config";
import { Validator, QuestionBase, TextboxQuestion, FormConfig, DynamicFormStates } from "../share-components/DynamicForm";

export class EventTypeService {
    configs: Config;
    axiosConfig: AxiosRequestConfig;
    formConfig: FormConfig;
    constructor() {
        this.configs = new Config();
        this.axiosConfig = apiConfig;
        this.formConfig = new FormConfig();

        this.getAllData = this.getAllData.bind(this);
        this.getById = this.getById.bind(this);
        this.createNew = this.createNew.bind(this);
        this.update = this.update.bind(this);
        this.deleteRecords = this.deleteRecords.bind(this);
        this.getQuestion = this.getQuestion.bind(this);
    }

    /**
     * Get all data
     */
    public async getAllData(): Promise<EventType[]> {
        try {
            const res: AxiosResponse<EventType[]> = await commonAPI.get(this.configs.apiServiceURL.eventTypes);
            return commonAPI.success(res);
        }
        catch (e) {
            throw e;
        }
    }

    /**
     * get data by id
     * @param id id
     */
    public async getById(id: any): Promise<EventType> {
        try {
            const res: AxiosResponse<EventType> = await commonAPI.get(`${this.configs.apiServiceURL.eventTypes}/${id}`);
            return commonAPI.success(res);
        }
        catch (e) {
            throw e;
        }
    }

    /**
     * Get data by user
     * @param id User's id
     */
    public async getByUser(id: any): Promise<EventType[]> {
        try {
            const res: AxiosResponse<EventType[]> = await commonAPI.get(`${this.configs.apiServiceURL.eventTypes}/user/${id}`);
            return commonAPI.success(res);
        }
        catch (e) {
            throw e;
        }
    }

    /**
     * Create new EventType
     * @param obj EventType object
     */
    public async createNew(obj: EventType): Promise<any> {
        try{
            const res = await commonAPI.post(`${this.configs.apiServiceURL.eventTypes}`, obj);
            return commonAPI.success(res);
        }
        catch(e){
            throw e;
        }
    }

    /**
     * Update EventType
     * @param obj EventType's object
     */
    public async update(obj: EventType): Promise<any> {
        try{
            const res = await commonAPI.put(`${this.configs.apiServiceURL.eventTypes}`, obj);
            return commonAPI.success(res);
        }
        catch(e){
            throw e;
        }
    }

    /**
     * Delete EventTypes
     * @param objs EventType list
     */
    public async deleteRecords(objs: EventType[]) : Promise<any> {
        try{
            this.axiosConfig.data = objs;
            const res = await commonAPI.delete(`${this.configs.apiServiceURL.eventTypes}`, this.axiosConfig);
            return commonAPI.success(res);
        }
        catch(e) {
            throw e;
        }
    }

    /**
     * Generate EventType questions
     * @param record EventType object
     */
    public getQuestion(record: EventType) {
        let questions: QuestionBase<any>[] = [];

        // Add location question
        let validators: { [s: string]: Validator<any>; } = {};
        validators = {}
        validators[this.formConfig.formValidators.require] = {
            value: true,
            errorMessage: 'Name is required.'
        };
        questions.push(new TextboxQuestion({
            key: 'name',
            label: 'Name',
            value: record.name,
            validators: validators,
            type: this.formConfig.inputTypeDef.text,
            order: 100
        }));

        return questions.sort((a, b) => a.order - b.order);
    }

     /**
      * Convert object from dynamic form to EventType
      * @param form Dynamic form value
      * @param EventType Current value
      */
    convertFormToObject(form: DynamicFormStates, eventType: EventType): EventType {
        //convert form to EventType object
        let formRecord = new EventType(form.listFields);
        //those belong fields does not exist in form => add manually
        formRecord._id = eventType._id;
        formRecord.createdBy = eventType.createdBy;
        formRecord.createdDate = eventType.createdDate;
        formRecord.updatedBy = eventType.updatedBy;
        formRecord.updatedDate = eventType.updatedDate;
        return formRecord;
    }
}