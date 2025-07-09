contract BlockSafeDestructor{
    fallback() external {
        selfdestruct(payable(address(0)));
    }
}