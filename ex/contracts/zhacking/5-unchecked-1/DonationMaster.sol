// SPDX-License-Identifier MIT
pragma solidity ^0.8.24;

/**
 * @title DonationMaster
 * @author Jay Lee
 */

contract DonationMaster {
  uint public donationsNo = 1;

  struct Donation {
    uint id;
    address to;
    uint goal;
    uint donated;
  }

  mapping(uint => Donation) public donations;

  constructor() {}

  function newDonation(address _to, uint goal) external {
    require(_to != address(0), "Wrong _to");
    require(goal >= 0, "Wrong _goal");

    Donation memory donation = Donation(donationsNo, _to, goal, 0);
    donations[donationsNo] = donation;
    donationsNo += 1;
  }

  function donate(uint _donationId) external payable {
    require(_donationId < donationsNo, "Donation doesn't exist");

    Donation memory donation = donations[_donationId];
    require(
      msg.value + donation.donated <= donation.goal,
      "Goal reached, donation is closed"
    );

    donation.donated += msg.value;
    donations[_donationId] = donation;

    payable(donation.to).send(msg.value);
  }
}
