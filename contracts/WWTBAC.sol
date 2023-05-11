//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

//imports from OpenZeppelin
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


//custom Errors
error wwtbac_NotOwner();

/**@title A sample ERC20 contract for a mini game
* @author Code HadIt
* @notice This contract is for creating a sample ERC20 based token
* @dev This imports the openZeppelin ERC20 token standard
*/
contract WWTBAC is ERC20 {
    
    modifier onlyOwner {
        if(msg.sender != owner){
            revert wwtbac_NotOwner();
        }
        _;
    }

    address private owner;
    address private manager;
    uint private supply;
    

    constructor(address _manager) ERC20("Cryptonaire", "WWTBAC") {
        owner = msg.sender;
        manager = _manager;
        uint mintAmount = 1e18;
        _mint(manager, mintAmount);
        supply = mintAmount;
    }

    receive() external payable {}
    
    // * fallback function
    fallback() external payable {}

    function mintMoreTokens(uint256 amount) external onlyOwner {
        require(supply <= 1000000000, "The game still has enough tokens");
        _mint(manager, amount );
        supply += amount;
    }

    function changeOwner(address _newOwner) external onlyOwner {
        owner = _newOwner;
    }

    function burn(uint amount) external {
        _burn(msg.sender, amount);
        supply -= amount;
    }

    function burnSupply (uint amount) external onlyOwner {
        _burn(manager, amount);
        supply -= amount;
    }

    function getOwner() external view returns (address) {
        return owner;
    }

    function totalSupply() public view override returns (uint256) {
        return supply;
    }

}

//custom Errors
error manager_NotOwner();
error manager_AddressZero();

/**@title A manager contract for the ERC20 contract
* @author Code HadIt
* @notice This contract solely calls specific functions in our ERC20 contract
* @dev Contract calls transfer on ERC20 token so as to keep the total supply fixed/deflationary.
*/

contract ManagerContract {
    address public wwtbacTokenAddress;
    address public owner;
    constructor(){
        owner = msg.sender;
    }

    modifier onlyOwner() {
        if(msg.sender != owner) {
            revert manager_NotOwner();
        }
        _;
    }

    modifier notAddressZero() {
        if(wwtbacTokenAddress == address(0)) {
            revert manager_AddressZero();
        }
        _;
    }

    function setMyTokenAddress(address _wwtbacTokenAddress) public onlyOwner {
        wwtbacTokenAddress = _wwtbacTokenAddress;
    }

    function innerTransfer(address _to, uint _amount) public notAddressZero {
        (bool success, ) = wwtbacTokenAddress.call(abi.encodeWithSignature("transfer(address,uint256)",_to,_amount));
    }
}