// API Response Types
export interface BranchIdentity {
  Code: string;
  Id: string;
}

export interface CountryState {
  StateName: string;
  CountryCode: string;
  CountryName: string;
  StateCode: string;
}

export interface Attachment {
  ImageString: string;
}

export interface BranchTiming {
  DayString: string;
  Shifts: string[];
}

export interface BranchOfficeTiming {
  BranchTimings: BranchTiming[];
}

export interface BranchType {
  BranchTypeID: string;
  Name: string;
  Attachment: Attachment;
}

export interface Branch {
  _id: string;
  Identity: BranchIdentity;
  CountryState: CountryState;
  Attachment: Attachment;
  Address: string;
  BranchOfficeTiming: BranchOfficeTiming;
  BranchType: BranchType;
  ContactNo: string;
  Description: string;
  EmailID: string;
  GoogleLocationURL: string;
  Message: string;
  Name: string;
  TelephoneNo: string;
  SequenceNo: number;
  HoursToGetReady: number;
}

export interface BranchesResponse {
  result?: Branch[];
}

