import BaseModel from "../baseModel";
interface ChainTokenApiModelParamModelInterface {
    Amount: number;
    ID: string;
    Name: string;
    Symbol: string;
}
declare class ChainTokenApiModel extends BaseModel {
    supplyAmount: number;
    symbol: string;
    name: string;
    tokenId: string;
    constructor(data: ChainTokenApiModelParamModelInterface);
}
export default ChainTokenApiModel;
//# sourceMappingURL=chainTokenApi.d.ts.map