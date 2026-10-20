package com.boardapp.boardapp.config;

import jakarta.persistence.EntityManager;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class TenantInterceptor implements HandlerInterceptor {

    @Autowired
    private EntityManager entityManager;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String tenantId = TenantContext.getCurrentTenantId(); // from JWT filter
        if (tenantId != null) {
            entityManager.createNativeQuery(
                    "SET app.current_tenant_id = '" + tenantId + "'"
            ).executeUpdate();
        }
        return true;
    }
    @Override
    public void afterCompletion(
            HttpServletRequest request,
            HttpServletResponse response,
            Object handler,
            Exception ex) {

        entityManager.createNativeQuery(
                "RESET app.current_tenant_id"
        ).executeUpdate();


        TenantContext.clear();
    }
}