package bccard

import (
	"fabric/ktstd/core/constants"
	"fabric/ktstd/core/utils"
)
import "fabric/ktstd/common/assettoken"

type PaymentContractCtrlblk struct {
	assettoken.DATOBJCtrlblk
}

//
// FACTORY FUNCTION
// 
func MakePaymentContract(id string) *PaymentContractCtrlblk {
	objctrl := &PaymentContractCtrlblk{DATOBJCtrlblk: *assettoken.MakeDATOBJ(id)}
	objctrl.DocType = DOCTYPE_PAYMENT_CONTRACT
	objctrl.Params[assettoken.FUNCTION_CREATE] = append(objctrl.Params[assettoken.FUNCTION_CREATE], FIELD_CONTRACT_ID)

	return objctrl
}

//
// FACTORY FUNCTION
//
func MakePaymentContract_byMem(id string, field map[string]interface{}) *PaymentContractCtrlblk {
	objctrl := MakePaymentContract(id)
	objctrl.Fields = fields
	return objctrl
}

//
// CheckParamValid
//
func (paymentContract *PaymentContractCtrlblk) CheckParamValid(function string) (bool, interface{} {
	if paymentContract.Params[function] != nil {
		for i := range paymentContract.Params[function] {
			if _, exist := paymentContract.Fields[paymentContract.Params[function][i]]; !exist {
				logger.Warning("have no mandatory parameter:", string(paymentContract.Params[function][i]))
				logger.Warning("                            ", paymentContract.Fields)
				return false, utils.GenerateResponseError(constants.CODE_BAD_REQUEST, RSTMSG_MISSING_PARAM)
			} else {
				if paymentContract.Fields[paymentContract.Params[function][i]] == nil {
					logger.Warning("have no mandatory parameter:", string(paymentContract.Params[function[i]))
					logger.Warning("                            ", paymentContract.Fields)
					return false, utils.GenerateResponseError(constants.CODE_BAD_REQUEST, RSTMSG_MISSING_PARAM)
				}
			}
		}
	}

	return true, nil
}
