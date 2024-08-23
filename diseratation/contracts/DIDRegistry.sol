/**
 *Submitted for verification at polygonscan.com on 2021-12-29
*/

//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 *@title PolygonDidRegistry
 *@dev Smart Contract for Polygon DID Method
 */
contract DidRegistry {
    address owner;
    struct vcDetails{
        string vcHash;
    }
    struct  PolyDID  {
        address controller;
        uint256 created;
        uint256 updated;
        string did_doc;
    } 
    modifier onlyController(address _id) {
        require(
            did[_id].controller == msg.sender, "message sender is not the controller"
        );
        _;
    }
    mapping(address => mapping(string => vcDetails)) vcStore;  
    mapping(address => PolyDID) public did;
    mapping(uint8 => string) public test;

    //Events in solidity?? for self_learning
    event DidCreated(address id, string doc);
    event DidUpdated(address id, string doc);
    event DidDeleted(address id);
    event TransferOwnership(address newOwner);
    event vcHashStored(address id,string did);

    constructor (){
        owner = msg.sender;
     
    }
    //modifier?
    modifier onlyOwner(){
        require( msg.sender == owner, "message sender is not the owner");
        _;
    }

    function transferOwnership(address newOwner)public onlyOwner() returns (string memory){
        if(owner != newOwner){
            owner = newOwner;
            emit TransferOwnership(owner);
            return ("Ownership transffered successfully");
        }
        else {
            return ("New Owner address is equal to original owner address");
        }
    }

    /**
     *@dev Register a new DID
     *@param _id - Address that will refer the DID doc
     *@param _doc - A string object that holds the DID Doc
     */
    function createDID(address _id, string memory _doc)
        public
        returns (address controller, uint256 created, uint256 updated, string memory did_doc)
    {
        did[_id].controller = msg.sender;
        did[_id].created = block.timestamp;
        did[_id].updated = block.timestamp;
        did[_id].did_doc = _doc;
        emit DidCreated(_id, _doc);
        return (did[_id].controller, did[_id].created, did[_id].updated, did[_id].did_doc);
    }

    /**
     *@dev Reads DID Doc from Chain
     *@param _id - Address that refers to the DID doc position
     */
    function getDID(address _id) public view returns (string memory) {
        return did[_id].did_doc;
    }

    function setTest(uint8 _id,string memory value) public  {
         test[_id]= value;
    }
    /**
     *@dev To Update the DID doc
     *@param _id - Address that refers to the DID doc
     *@param _doc - A String that holds the DID doc
     */
    function updateDID(address _id, string memory _doc)
        public
        onlyController(_id) returns(address controller, uint256 created, uint256 updated, string memory did_doc)
    {
        did[_id].did_doc = _doc;    
        did[_id].updated = block.timestamp;
        emit DidUpdated(_id, _doc); //how does emit works??
        return (did[_id].controller, did[_id].created, did[_id].updated, did[_id].did_doc);
    }

function storeVcHash(address _id, string memory _did,string memory _hash)
        public onlyOwner()
    {
       
        vcStore[_id][_did].vcHash = _hash;
        emit vcHashStored(_id, _did);
        // return (did[_id].controller, did[_id].created, did[_id].updated, did[_id].did_doc);
    }
      function getVcDetails(address _id,string memory _did) public view returns (string memory) {
        return vcStore[_id][_did].vcHash;
    }

//  function storeVcHash(address _id, string memory _did,string memory _hash)
//         public onlyOwner()
//     {
       
//         vcStore[_id][_did].vcHash = _hash;
//         emit vcHashStored(_id, _did);
//         // return (did[_id].controller, did[_id].created, did[_id].updated, did[_id].did_doc);
//     }
//       function getVcDetails(address _id,string memory _did) public view returns (string memory) {
//         return vcStore[_id][_did].vcHash;
//     }

    

    /**
     *@dev To delete a DID from chain
     *@param _id - Address that refers to the DID doc that need to be deleted
     */
    function deleteDID(address _id) public onlyController(_id) {
        delete did[_id];
        emit DidDeleted(_id);
    }
}