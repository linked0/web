export function getBasicOrderParameters(): any {
  const basicOrderParameters = {
    offerer: '0x4c44b0D3F838af3CFAa9E6784495E1beeb70855D',
    zone: '0xD387fad497b9f393e9564C40A6d1F3E80D36e81e',
    basicOrderType: 8,
    offerToken: '0x8a4613e769C3A98Dc175cb7c7fbb3DA454ec62B2',
    offerIdentifier: 179482772744195362887760488537518762319n,
    offerAmount: 1n,
    considerationToken: '0x8f6Dd050F74A978547EFA22aAA241006c78A5814',
    considerationIdentifier: 0,
    considerationAmount: 266168837647951545979819n,
    startTime: 0,
    endTime: 5172014448931175958106549077934080n,
    zoneHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    salt: '0x63626ce3751f8a92b94ec1a3b675f3ca0deeaff7f5eb3db2c4083e365e6483bc',
    totalOriginalAdditionalRecipients: 2n,
    signature: '0x3d9303ebbdbb3be5f197dab8dd56e2668b1fbb21b852b6452097c1f06db856580223defac010c23227d408d189010fa163bf433a9f27ccb790beb2daa58ef4421c',
    offererConduitKey: '0x0000000000000000000000000000000000000000000000000000000000000000',
    fulfillerConduitKey: '0x0000000000000000000000000000000000000000000000000000000000000000',
    additionalRecipients: [
      {
        amount: 50n,
        recipient: '0xD387fad497b9f393e9564C40A6d1F3E80D36e81e'
      },
      {
        amount: 50n,
        recipient: '0x9dfC0295f3F01C9A0f4FFb2231cE3626e17c1AAD'
      }
    ]
  }

  return basicOrderParameters;
}