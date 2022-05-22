const chai = require("chai");
const { ethers } = require("hardhat");
const { groth16 } = require("snarkjs");
const wasm_tester = require("circom_tester").wasm;

const assert = chai.assert;

const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);


describe("MasterMindVaration", function () {
  // let Verifier;
  // let verifier;
  beforeEach(async function () {
    // Verifier = await ethers.getContractFactory("MastermindVariationVerifier");
    // verifier = await Verifier.deploy();
    // await verifier.deployed();
  });

  it("Valid hash", async function () {
    const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom");
    await circuit.loadConstraints();

    const Input = {
      "pubGuessA": "1",
      "pubGuessB": "2",
      "pubGuessC": "3",
      "pubNumHit": "3",
      "pubNumBlow": "0",
      "pubSolnHash": "1005794914719352049221795958156931033972126599299790994184579763712006026032",
      "privSolnA": "1",
      "privSolnB": "2",
      "privSolnC": "3",
      "privSalt": "1",
    }
    const witness = await circuit.calculateWitness(Input, true);

    // console.log(witness);

    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)));
    assert(Fr.eq(Fr.e(witness[1]), Fr.e('1005794914719352049221795958156931033972126599299790994184579763712006026032')));
  });

  it("inValid hash", async function () {
    const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom");
    await circuit.loadConstraints();

    const Input = {
      "pubGuessA": "1",
      "pubGuessB": "2",
      "pubGuessC": "3",
      "pubNumHit": "3",
      "pubNumBlow": "0",
      "pubSolnHash": "1005794914719352049221795958156931033972126599299790994184579763712006026030",
      "privSolnA": "1",
      "privSolnB": "2",
      "privSolnC": "3",
      "privSalt": "1",
    }
    try {
      const witness = await circuit.calculateWitness(Input, true);
    } catch (e) {
      assert(e, null);
    }

    // console.log(witness);

    // assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)));
    // assert(Fr.eq(Fr.e(witness[1]), Fr.e('1005794914719352049221795958156931033972126599299790994184579763712006026032')));

  });
});
