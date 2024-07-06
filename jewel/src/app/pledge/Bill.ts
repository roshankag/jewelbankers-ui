import { Data } from "@angular/router";
import { BillDetail } from "./BillDetails";


export interface Bill {
    billSequence?: number;
    billSerial: string;
    billNo: number;
    billDate: string;
    customer: any;
    careOf: string;
    productTypeNo: number;
    rateOfInterest: number;
    amount: number;
    amountInWords: string;
    presentValue: number;
    grams: number;
    monthlyIncome: number;
    redemptionDate: string;
    redemptionInterest: number;
    redemptionTotal: number;
    redemptionStatus: string;
    billRedemSerial: string;
    billRedemNo: number;
    comments: string;
    billDetails: BillDetail[];
  }
  