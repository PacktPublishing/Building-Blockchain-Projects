pragma solidity ^0.4.0;

import "github.com/oraclize/ethereum-api/oraclizeAPI.sol";
import "github.com/Arachnid/solidity-stringutils/strings.sol";

contract Betting is usingOraclize
{
    using strings for *;
    
    string public matchId;
    uint public amount;
    string public url;
    
    address public homeBet;
    address public awayBet;

    function Betting(string _matchId, uint _amount, string _url) 
    {
        matchId = _matchId;
        amount = _amount;
        url = _url;
        
        oraclize_setProof(proofType_TLSNotary | proofStorage_IPFS);
    }
    
    //1 indicates home team
    //2 indicates away team
    function betOnTeam(uint team) payable
    {
        
        if(team == 1)
        {
            if(homeBet == 0)
            {
                if(msg.value == amount)
                {
                    homeBet = msg.sender;   
                    if(homeBet != 0 && awayBet != 0)
                    {
                        oraclize_query("URL", url);
                    }
                }
                else
                {
                    throw;
                }
            }
            else
            {
                throw;
            }
        }
        else if(team == 2)
        {
            if(awayBet == 0)
            {
                if(msg.value == amount)
                {
                    awayBet = msg.sender;          
                
                    if(homeBet != 0 && awayBet != 0)
                    {
                        oraclize_query("URL", url);
                    }
                }
                else
                {
                    throw;
                }
            }
            else
            {
                throw;
            }
        }
        else
        {
            throw;
        }
    }
    
    function __callback(bytes32 myid, string result, bytes proof) {
        if (msg.sender != oraclize_cbAddress())
        {
            throw;    
        }
        else
        {
            if(result.toSlice().equals("home".toSlice()))
            {
                homeBet.send(this.balance);
            }
            else if(result.toSlice().equals("away".toSlice()))
            {
                awayBet.send(this.balance);
            }
            else if(result.toSlice().equals("draw".toSlice()))
            {
                homeBet.send(this.balance / 2);
                awayBet.send(this.balance / 2);
            }
            else
            {
                if (oraclize.getPrice("URL") < this.balance) 
                {
                    oraclize_query(86400, "URL", url);
                }
            }
        }
    }
}