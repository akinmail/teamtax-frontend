pragma solidity ^0.4.21;
//EtherGram - an Ethereum "Instagram" copy
//Simplified Version - "test" for Seun

//@dev - the usage of the smart contract is to let users upload photos to IPFS
//@dev - Each photo get tags

contract ethergram {
    
    uint userID = 0;

    //Track Hashtags
    mapping (string => bytes32[]) _hashtagtagToPostIds;
    mapping (bytes32 => string[]) _postIdsToHashtags;


    event gram(
        address indexed _posterAddress, //The Ethereum address of the person who made the post
        string  indexed _userName, //The Username of the person who made the post
        bytes32 indexed _postId, //The post ID
        bytes32 _postTextLink,  //Link to the test of the post
        bytes32 _imageLink,      //Linke to the Image of the post
        string _hashtag1,
        string _hashtag2,
        string _hashtag3
    );
    
    
    function makeGram(bytes32 _imageLink, bytes32 _postTextLink, string _hashtag1, string _hashtag2, string _hashtag3) public returns(bytes32){
        //@dev _imageLink - the web front end takes a picture, and saves it to IPFS. This variable
        //is the bytes32 IPFS link to this image.
        //@dev _postTextLink - the web front end allows users to enter text for the image. This text
        //is uploaded to IPFS and the link is pased in this variable. 
        //@dev _hashtags - the web front end needs to parse the Hashtags included in the text and
        //send this as an array into the makeGram function. 
       //@dev - in the real version of this software, there would be another function which takes the 
       //address of the Ethereum User and finds their user name. For now we will set the user to "testuser"
       
       //@dev - this is a check to be sure our strings are not empty and not too long
       require(requireNotEmpty(_hashtag1) && requireMaxLength(_hashtag1, 15));
       require(requireNotEmpty(_hashtag2) && requireMaxLength(_hashtag2, 15));
       require(requireNotEmpty(_hashtag3) && requireMaxLength(_hashtag3, 15));
       
       //@dev - this is a check that our links are not empty
       require(_imageLink != keccak256(""));
       require(_postTextLink != keccak256(""));
 
        string memory _userName = "testuser";
        
        
        
        //@dev we create a unique post ID here. Again we are doing just a testID. A real example would
        //need to create unique ID's. In this case we increment a hash of testNumberForId
        bytes32 _postId = keccak256(userID);
        userID++;
        
        emit gram(msg.sender, _userName, _postId, _postTextLink, _imageLink, _hashtag1, _hashtag2, _hashtag3);
    }
    
    function requireMaxLength (string _text, uint _length) private pure returns(bool){
        
        if(bytes(_text).length <= _length){
            return(true);
        } else {
            return(false);
        }
        
    }
    
    function requireNotEmpty (string _text) private pure returns(bool){
        if(bytes(_text).length == 0){
            return(false);
        } else {
            return(true);
        }
    }
    
}
