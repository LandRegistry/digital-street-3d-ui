# Changelog

Note that requirements updates are not listed here unless they result in more changes than just updating the version number.

| Date | Summary | Comparison to previous |
|---|---|---|
| 2018-03-06 | Small tweak to csrf extension to make it possible to mark views as exempt       | [Here](!19) | 
| 2018-03-06 | utils.request_wants_json() moved into utils sub folder                          | [Here](!19) | 
| 2018-02-19 | Added Content Security Policy & serve via self signed https cert in dev env     | [Here](!17) |
| 2018-02-08 | Added CSRF protection for Flask-WTForms and rendering of flask flash() messages | [Here](!16) |
| 2018-02-02 | nodejs/gulp frontend build process now back in Dockerfile                                                                      | [Here](!15) |
| 2018-02-02 | Many unit tests added                                                                                                          | [Here](!14) |
| 2018-01-17 | GOV.UK kit now included in the skeleton (Previously had been demoed in gadget-govuk-ui)                                        | [Here](!12) |
|            | Jinja markdown filter now available to generate GOV.UK compatible html from markdown                                           |             |
|            | pip-compile should now be run via ./pipcompilewrapper.sh in order to pick up git dependencies in requirements.txt              |             |
|            | Added flask-wtf as this should be used for processing and validating forms                                                     |             |
|            | Minified CSS/JS now hidden behind a conditional comment to allow us to serve unminified JS to IE8 and avoid IE8 parsing errors |             |
| 2018-01-17 | Allow application errors to be logged at a higher level by passing force_logging=True                              | [Here](!13) |
| 2018-01-15 | Better logging for 404s and other http exceptions so that they report the path                                     | [Here](53c69a6bdd80e1139a0872ba5f659635facff3ca) |  |             |
| 2018-01-12 | Make the app fall over more gracefully if the static assets are missing                                            | [Here](ec499f7dfc827dc902d2ff0396f096c26015d9fc...58e70373d9d6bdbf5d81ce5c9750dd6294c8292f) |  |             |
| 2018-01-09 | Better backwards compatibility for logging                                                                         | [Here](ec499f7dfc827dc902d2ff0396f096c26015d9fc) |  |             |
| 2017-10-06 | Update gulp tasks to v2.0.0. Switched to Webpack and tweaked gulpfile config structure                             | [Here](8e25e6efcc23476c9526c7774de1ba4b3c9db160) |  |             |
| 2017-10-06 | Remove nodejs/gulp build process from Dockerfile                                                                   | [Here](a43006db3ceb40e71a476a6ec18d65ac0ec6c2bd) |
