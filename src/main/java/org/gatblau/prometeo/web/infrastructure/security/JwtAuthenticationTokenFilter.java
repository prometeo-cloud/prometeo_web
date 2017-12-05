package org.gatblau.prometeo.web.infrastructure.security;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;
import org.gatblau.prometeo.web.infrastructure.security.authentication.UserAuthenticator;
import org.gatblau.prometeo.web.infrastructure.security.authentication.UserPrincipal;

import javax.inject.Inject;
import javax.inject.Named;
import javax.inject.Singleton;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;

@Named
@Singleton
public class JwtAuthenticationTokenFilter extends OncePerRequestFilter {

    private static final String BEARER = "Bearer ";
    private final Log LOG = LogFactory.getLog(this.getClass());

    @Inject
    private UserAuthenticator userAuthenticator;

    @Override
    protected void doFilterInternal(final HttpServletRequest request,
                                    final HttpServletResponse response,
                                    final FilterChain chain)
        throws ServletException, IOException {

        final String authHeaderValue = request.getHeader(AUTHORIZATION);

        if (authHeaderValue != null && authHeaderValue.contains(BEARER)) {
            final String tokenString = authHeaderValue.substring(BEARER.length());
            final UserPrincipal userPrincipal = userAuthenticator.validateToken(tokenString);
            if (userPrincipal != null) {
                final UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    userPrincipal, null, userPrincipal.getAuthorities());

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        chain.doFilter(request, response);
    }
}