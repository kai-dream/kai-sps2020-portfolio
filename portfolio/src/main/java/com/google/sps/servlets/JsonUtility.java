// Data type class to send Comment back to front-end
package com.google.sps.servlets;

import com.google.gson.Gson;

public class JsonUtility {
    public static <T> String ToJson(T obj) {
        Gson gson = new Gson();
        String jsonString = gson.toJson(obj);
        return jsonString;
    }
}
