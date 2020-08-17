import { KeyValue } from "../class/common/keyValue"

export class Config {
    apiServiceURL = {
        login: `${process.env.REACT_APP_SERVER_URL}/api/login`,
        logout: `${process.env.REACT_APP_SERVER_URL}/api/logout`,
        register:`${process.env.REACT_APP_SERVER_URL}/api/register`,
        bookings: `${process.env.REACT_APP_SERVER_URL}/api/bookings`,
        eventTypes: `${process.env.REACT_APP_SERVER_URL}/api/eventtypes`
    }

    commonMessage = {
        loginError: 'Login error!!!',
        userNotFound: 'User not found!!!',
        signUpSuccess: 'Register success!!!',
        signUpError: 'Register error!!!',
        deleteSuccess: 'Delete success!!!',
        deleteError: 'Delete error!!!',
        createSuccess: 'Create success!!!',
        createError: 'Create error!!!',
        updateSuccess: 'Update success!!!',
        updateError: 'Update error!!!'
    }

    roleDefinition = {
        fullertonAdmin: 1,
        companyHR: 2
    }

    alertVariants = {
        primary :'primary',
        secondar :'secondary',
        success :'success',
        danger :'danger',
        warning :'warning',
        info :'info',
        light :'light',
        dark :'dark'
    }

    datetimeFormat = {
        yyyyMMdd: 'yyyy/MM/dd',
        ddMMyyyy: 'dd/mm/yyyy',
        yyyyMMddHHmm: 'yyyy/MM/dd HH:mmm'
    }
    
    bookingStatus = {
        pendingReview: new KeyValue({key: 1, value: 'Pending Review'}),
        approved: new KeyValue({key: 2, value: 'Approved'}),
        rejected: new KeyValue({key: 3, value: 'Rejected'})
    }

    /**
     * later implement from database
     */
    bookingEventTypes:any = {
        'healthTalk': new KeyValue({key: 1, value: 'Dropdown with Health Talk'}),
        'wellnessEvents': new KeyValue({key: 2, value: 'Wellness Events'}),
        'fitnessActivities': new KeyValue({key: 3, value: 'Fitness Activities'})
    }

}