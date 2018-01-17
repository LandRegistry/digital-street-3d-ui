# Changelog

Note that requirements updates are not listed here unless they result in more changes than just updating the version number.

| Date | Summary | Comparison to previous |
|---|---|---|
| 2018-01-17 | GOV.UK kit now included in the skeleton (Previously had been demoed in gadget-govuk-ui)                            | [Here](!12) |
|            | Jinja markdown filter now available to generate GOV.UK compatible html from markdown                               |             |
|            | pip-compile should now be run via ./pipcompilewrapper.sh in order to pick up git dependencies in requirements.txt  |             |
|            | Added flask-wtf as this should be used for processing and validating forms                                         |             |
| 2018-01-15 | Better logging for 404s and other http exceptions so that they report the path                                     | [Here](53c69a6bdd80e1139a0872ba5f659635facff3ca) |  |             |
| 2018-01-12 | Make the app fall over more gracefully if the static assets are missing                                            | [Here](ec499f7dfc827dc902d2ff0396f096c26015d9fc...58e70373d9d6bdbf5d81ce5c9750dd6294c8292f) |  |             |
| 2018-01-09 | Better backwards compatibility for logging                                                                         | [Here](ec499f7dfc827dc902d2ff0396f096c26015d9fc) |  |             |
| 2017-10-06 | Update gulp tasks to v2.0.0. Switched to Webpack and tweaked gulpfile config structure                             | [Here](8e25e6efcc23476c9526c7774de1ba4b3c9db160) |  |             |
| 2017-10-06 | Remove nodejs/gulp build process from Dockerfile                                                                   | [Here](a43006db3ceb40e71a476a6ec18d65ac0ec6c2bd) |
