// Data type class to send LoginStatus back to front-end
// LogOutUrl is only non-empty if isLoggedIn is true.
// LogInUrl is only non-empty if isLoggedIn is false.
package com.google.sps.servlets;

public class LoginStatus {
    public boolean isLoggedIn;
    public String logOutUrl;
    public String logInUrl;
    public AccountInfo account;
}
