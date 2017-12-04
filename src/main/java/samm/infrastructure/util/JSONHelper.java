package samm.infrastructure.util;

import com.fasterxml.jackson.databind.ObjectMapper;

import javax.inject.Named;
import javax.inject.Singleton;
import java.io.IOException;
import java.io.StringWriter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Named
@Singleton
public class JSONHelper {
    private static final Logger LOG = LoggerFactory.getLogger(JSONHelper.class);

    public String getJSONForObject(final Object obj) {
        try {
            final ObjectMapper mapper = new ObjectMapper();
            final StringWriter sw = new StringWriter();
            mapper.writeValue(sw, obj);

            return sw.toString();
        } catch (Exception e) {
            LOG.error(e.getMessage());
            throw new RuntimeException(e);
        }
    }

    public <T> T getObjectForJSON(final String jsonString, final Class<T> clazz) {
        try {
            final ObjectMapper mapper = new ObjectMapper();
            final T obj = mapper.readValue(jsonString, clazz);

            return obj;
        } catch (IOException e) {
            LOG.error(e.getMessage());
            throw new RuntimeException(e);
        }
    }
}
