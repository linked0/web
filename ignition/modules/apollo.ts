import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

import libArtifact from "../../libArtifacts/BasicLibrary.json";
import withLibArtifact from "../../libArtifacts/ContractWithLibrary.json";

export default buildModule("Apollo", (m) => {
  const apollo = m.contract("Rocket", ["Saturn V"]);
  m.call(apollo, "launch", []);

  const acct2 = m.getAccount(2);

  const basic = m.contract("BasicContract", [acct2]);
  const library = m.library("BasicLibrary");
  const libFromArtifact = m.library("BasicLibrary", libArtifact, {
    id: "BasicLibrary2",
  });
  const withLib = m.contract("ContractWithLibrary", withLibArtifact, [], {
    libraries: { BasicLibrary: library },
  });

  const call = m.call(basic, "basicFunction", [40]);
  const eventArg = m.readEventArgument(call, "BasicEvent", "eventArg");
  m.staticCall(withLib, "readonlyFunction", [eventArg]);

  const duplicate = m.contractAt("BasicContract", basic, {
    id: "BasicContract2",
  });
  const duplicateWithLib = m.contractAt(
    "ContractWithLibrary",
    withLibArtifact,
    withLib,
    { id: "ContractWithLibrary2" }
  );

  const data = m.encodeFunctionCall(duplicate, "otherFunction", [42n]);

  m.send("test_send", duplicate, 123n, data);

  return {
    apollo,
    basic,
    library,
    libFromArtifact,
    withLib,
    duplicate,
    duplicateWithLib,
  };
});
