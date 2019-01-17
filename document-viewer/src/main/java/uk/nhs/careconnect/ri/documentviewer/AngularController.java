package uk.nhs.careconnect.ri.documentviewer;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class AngularController {


    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public Object handleLogin() {
        return new ModelAndView
                ("forward:/" );
    }

    @RequestMapping(value = "/error", method = RequestMethod.GET)
    public Object handleError() {
        return new ModelAndView
                ("forward:/" );
    }


    @RequestMapping(value = "/ping", method = RequestMethod.GET)
    public Object handlePing() {
        return new ModelAndView
                ("forward:/" );
    }

    @RequestMapping(value = "/logout", method = RequestMethod.GET)
    public Object handleLogout() {
        return new ModelAndView
                ("forward:/" );
    }

    @RequestMapping(value = "/callback", method = RequestMethod.GET)
    public Object handleCallback() {
        return new ModelAndView
                ("forward:/" );
    }

    @RequestMapping(value = "/edms", method = RequestMethod.GET)
    public Object handleAmb() {

        return new ModelAndView
                ("forward:/" );
    }

    @RequestMapping(value = "/edms/{path}", method = RequestMethod.GET)
    public Object handleSubPath() {
       // System.out.println("handleSubPath");
        return new ModelAndView
                ("forward:/" );
    }

    @RequestMapping(value = "/edms/{path}/{patient}", method = RequestMethod.GET)
    public Object handlePatient() {

        return new ModelAndView
                ("forward:/" );
    }

    @RequestMapping(value = "/edms/{path}/{patient}/{subSection}", method = RequestMethod.GET)
    public Object handlePatientSection() {

        return new ModelAndView
                ("forward:/" );
    }


    @RequestMapping(value = "/exp", method = RequestMethod.GET)
    public Object displayED() {
       // System.out.println("exp Base");
        return new ModelAndView
                ("forward:/" );
    }

    @RequestMapping(value = "/exp/{subpath}", method = RequestMethod.GET)
    public Object edSubPath() {
        //System.out.println("exp SubPath");
        return new ModelAndView
                ("forward:/" );
    }

    @RequestMapping(value = "/exp/{path}/{resource}", method = RequestMethod.GET)
    public Object displayResource() {
       // System.out.println("exp resource");
        return new ModelAndView
                ("forward:/" );
    }

}
