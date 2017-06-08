## Champions League Bet

### Context

Is 2017, 4th of June at 9:00 AM UTC. The final of the UEFA Champions League is going to be played at 18:45 UTC of the same day and it will end around 2 hours later. The match will be played by Juventus and Real Madrid. There is two friends Paolo from the Juventus and Juan from the Real Madrid. Paolo says he is sure that Juventus will win and Juan says that Real Madrid will. Since they are so sure they decide to bet.

They are friends but they do not trust each other since they already bet on things and never make a resolution on the bet. That's why they decide to implement an Smart Contract.

For make it easy let's put some conditions:

- Paolo will deploy the contract with the amount of money that they want to bet
- Juan will match that money
- The bet won't be valid unless Juan put the same amount of money
- The resolution will be made from Paolo or Juan and will check the result from an external provider
- If Juan does not match the amount then the result does not matter and Paolo will recover his money

If you want to add more complexity you can cover:

- The resolution of the contract should be set at least two hours after the match will finish
- The amount cannot be matched after the match started

If you want even more you can:

- The match was cancelled and the API does not reflect it.

I will try to cover the first scenario.

### Resolution

External provider: https://champions-league-2017-result.herokuapp.com/
