import { DeptGroupResponse } from "./DeptGroupResponse";

export interface DeptResponse {
    code: string,
    name: string,
    deptGroup: DeptGroupResponse
}