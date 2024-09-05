%define _sourcedir /home/gustavoperez/code/mutuauth-middleware/dist/final
%define _rpmdir /home/gustavoperez/code/mutuauth-middleware/dist/final

Name: mutuauth-middleware
Version: 1.0.0
Release: 1%{?dist}
Summary: Sasquat Softwares mutual authentication middleware for Kentik agent

License: Proprietary
URL: https://www.sasquat-sw.com.br

Source0: %{name}.js

BuildArch: noarch

Requires: nodejs >= 16.18.1

%description
Sasquat Softwares mutual authentication middleware for Kentik agent.

%prep
# We don't need any preparation steps, as we're simply installing a single JS file.

%build
# We also don't need a build step, for the same reason.

%install
# Create the installation directory.
mkdir -p %{buildroot}/opt/%{name}

# Copy the JS file to the installation directory.
cp %{SOURCE0} %{buildroot}/opt/%{name}/

%files
# The JS file is included in the package.
/opt/%{name}/%{name}.js

%changelog
* Wed Jul 20 2023 Your Name <your_email@domain.com> - VERSION-RELEASE
- Initial RPM release