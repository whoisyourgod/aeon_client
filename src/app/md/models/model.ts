export interface GroupInfoResponse {
    data: {
        groupInfoList: GroupInfo[]
        errorMessageInfo: ErrorMessageInfo
    }
};

export interface GroupInfo {
    group1Code: string;
    group1Name: string;
    group2Code: string;
    group2Name: string;
    group3Code: string;
    group3Name: string;
    group4Code: string;
    group4Name: string;
    genCode: string;
    genName: string;
};

export interface GoodsInfoResponse {
    data: {
        classificationList: ClassificationInfo[];
        errorMessageInfo: ErrorMessageInfo;
    }
}

export interface ClassificationInfo {
    classification2CodeLog: string;
    classification3CodeLog: string;
    classification4CodeLog: string;
    classification2NameKanjiLog: string;
    classification3NameKanjiLog: string;
    classification4NameKanjiLog: string;
}

export interface PersonInfoResponse {
    data: {
        personInfo: PersonInfo;
        errorMessageInfo: ErrorMessageInfo;
    }
}

export interface PersonInfo {
    personId: string;
    personName: string;
}

export interface InitInfoResponse {
    data: {
        storeGroupInfoList: StoreGroupInfo[];
        goodsBaseInfoList: GoodsBaseInfo[];
        errorMessageInfo: ErrorMessageInfo;
    }
}

export interface StoreGroupInfo {
    storeGroupCode: string;
    storeGroupName: string;
}

export interface GoodsBaseInfo {
    janCode: string;
    janName: string;
}

export interface ErrorMessageInfo {
    errorCode: string;
    errorMessage: string;
}

export interface OrderInfoResponse {
    data: {
        goodsDisplayList: GoodsDisplayInfo[];
        countDisplayList: CountDisplayInfo[];
        errorMessageInfo: ErrorMessageInfo;
    }
};

export interface OrderInfoCsvResponse {
    data: {
        csvInfoStr: any;
        errorMessageInfo: ErrorMessageInfo;
    }
};

export interface GoodsDisplayInfo {
    groupCode: string;
    groupName: string;
    bumonCode: string;
    bumonName: string;
    categoryCode: string;
    categoryName: string;
    custermorName: string;
    productCode: string;
    janCode: string;
    janName: string;
    colourName: string;
    sizeName: string;
    orderSnum: string;
    orderDate: string;
    deliveryDate: string;
    orderNum: string;
}

export interface CountDisplayInfo {
    classification2CodeLog: string;
    classification3CodeLog: string;
    classification4CodeLog: string;
    classification2NameKanjiLog: string;
    classification3NameKanjiLog: string;
    classification4NameKanjiLog: string;
    totalOrderNum: string;
    totalOrderPrc: string;
    valuePct: string;
}

export interface FormInfo {
    kubenn1: string[];
    kubenn2: string;
    kubenn3: string;
    group1Code: string[];
    group2Code: string[];
    group3Code: string[];
    group4Code: string[];
    genCode: string[];
    storeGroupCode: string[];
    groupCode: string[];
    bumonCode: string[];
    categoryCode: string[];
    janCode: string[];
    orderDateFrom: string;
    orderDateTo: string;
    deliveryDateFrom: string;
    deliveryDateTo: string;
}
