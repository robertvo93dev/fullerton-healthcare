
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { Config } from "../configuration/config";
import { Booking } from "../class/booking";
import { commonAPI } from "./common-api.service";
import { apiConfig } from "../configuration/api.config";
import { Validator, QuestionBase, TextboxQuestion, DateTimeQuestion, FormConfig, DynamicFormStates, ReferenceQuestion } from "../share-components/DynamicForm";

export class BookingService {
    configs: Config;
    axiosConfig: AxiosRequestConfig;
    formConfig: FormConfig;
    constructor() {
        this.configs = new Config();
        this.axiosConfig = apiConfig;
        this.formConfig = new FormConfig();

        this.getAllData = this.getAllData.bind(this);
        this.getById = this.getById.bind(this);
        this.getByUser = this.getByUser.bind(this);
        this.createNew = this.createNew.bind(this);
        this.update = this.update.bind(this);
        this.deleteRecords = this.deleteRecords.bind(this);
        this.getQuestion = this.getQuestion.bind(this);
    }

    /**
     * Get all data
     */
    public async getAllData(): Promise<Booking[]> {
        try {
            const res: AxiosResponse<Booking[]> = await commonAPI.get(this.configs.apiServiceURL.bookings);
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
    public async getById(id: any): Promise<Booking> {
        try {
            const res: AxiosResponse<Booking> = await commonAPI.get(`${this.configs.apiServiceURL.bookings}/${id}`);
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
    public async getByUser(id: any): Promise<Booking[]> {
        try {
            const res: AxiosResponse<Booking[]> = await commonAPI.get(`${this.configs.apiServiceURL.bookings}/user/${id}`);
            return commonAPI.success(res);
        }
        catch (e) {
            throw e;
        }
    }

    /**
     * Create new booking
     * @param obj booking object
     */
    public async createNew(obj: Booking): Promise<any> {
        try{
            const res = await commonAPI.post(`${this.configs.apiServiceURL.bookings}`, obj);
            return commonAPI.success(res);
        }
        catch(e){
            throw e;
        }
    }

    /**
     * Update booking
     * @param obj booking's object
     */
    public async update(obj: Booking): Promise<any> {
        try{
            const res = await commonAPI.put(`${this.configs.apiServiceURL.bookings}`, obj);
            return commonAPI.success(res);
        }
        catch(e){
            throw e;
        }
    }

    /**
     * Delete bookings
     * @param objs booking list
     */
    public async deleteRecords(objs: Booking[]) : Promise<any> {
        try{
            this.axiosConfig.data = objs;
            const res = await commonAPI.delete(`${this.configs.apiServiceURL.bookings}`, this.axiosConfig);
            return commonAPI.success(res);
        }
        catch(e) {
            throw e;
        }
    }

    /**
     * Generate Booking questions
     * @param record Booking object
     */
    public getQuestion(record: Booking) {
        let questions: QuestionBase<any>[] = [];

        // Add location question
        let validators: { [s: string]: Validator<any>; } = {};
        validators = {}
        validators[this.formConfig.formValidators.require] = {
            value: true,
            errorMessage: 'Location is required.'
        };
        questions.push(new TextboxQuestion({
            key: 'location',
            label: 'Location',
            value: record.location,
            validators: validators,
            type: this.formConfig.inputTypeDef.text,
            order: 100
        }));

        //Add type of event question
        questions.push(new ReferenceQuestion({
            key: 'eventType',
            label: 'Event Type',
            value: record.eventType,
            serverUrl: this.configs.apiServiceURL.eventTypes,
            displayField: 'name',
            listFields: ['name'],
            searchBar: true,
            order: 200
        }));

        // Add proposed date 1
        questions.push(new DateTimeQuestion({
            key: 'proposedDateTime1',
            label: 'Proposed Date Time 1',
            value: record.proposedDateTime1 ? new Date(record.proposedDateTime1) : undefined,
            order: 400
        }));

        // Add proposed date 2
        questions.push(new DateTimeQuestion({
            key: 'proposedDateTime2',
            label: 'Proposed Date Time 2',
            value: record.proposedDateTime2 ? new Date(record.proposedDateTime2) : undefined,
            order: 500
        }));

        // Add proposed date 3
        questions.push(new DateTimeQuestion({
            key: 'proposedDateTime3',
            label: 'Proposed Date Time 3',
            value: record.proposedDateTime3 ? new Date(record.proposedDateTime3) : undefined,
            order: 600
        }));

        return questions.sort((a, b) => a.order - b.order);
    }

     /**
      * Convert object from dynamic form to Booking
      * @param form Dynamic form value
      * @param booking Current value
      */
    convertFormToObject(form: DynamicFormStates, booking: Booking): Booking {
        //convert form to booking object
        let formRecord = new Booking(form.listFields);
        //those belong fields does not exist in form => add manually
        formRecord._id = booking._id;
        formRecord.status = booking.status;
        formRecord.choosenDateTime = booking.choosenDateTime;
        formRecord.reasonForRejection = booking.reasonForRejection;
        formRecord.createdBy = booking.createdBy;
        formRecord.createdDate = booking.createdDate;
        formRecord.updatedBy = booking.updatedBy;
        formRecord.updatedDate = booking.updatedDate;
        return formRecord;
    }
}