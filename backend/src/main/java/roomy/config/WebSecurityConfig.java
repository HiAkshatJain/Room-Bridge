package roomy.config;


import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import roomy.filters.JwtAuthFilter;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    private static final String[] publicRoutes = {
            "/error",
            "/auth/**",
            "/health",
            "/ws/**",
            "/topic/**",
            "/app/**",

    };

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        // Public routes
                        .requestMatchers(publicRoutes).permitAll()


                        .requestMatchers(HttpMethod.POST, "/api/chat/send").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/chat/conversation").permitAll()

                        // Room APIs
                        .requestMatchers(HttpMethod.GET, "/api/room/**").permitAll()  // anyone can view rooms
                        .requestMatchers(HttpMethod.POST, "/api/room/**").authenticated() // only logged-in users can create rooms

                        // Room reviews
                        .requestMatchers(HttpMethod.POST, "/api/room-reviews/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/room-reviews/**").permitAll()

                        // Documents
                        .requestMatchers(HttpMethod.POST, "/documents/upload").authenticated()
                        .requestMatchers(HttpMethod.GET, "/documents/my-documents").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/documents/**").hasRole("ADMIN")

                        // Profiles
                        .requestMatchers(HttpMethod.POST, "/profile/upload-image").authenticated()
                        .requestMatchers(HttpMethod.GET, "/profile/**").authenticated()

                        // Any other request needs authentication
                        .anyRequest().authenticated()
                )
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173","http://localhost:5174"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Auth-Token"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
