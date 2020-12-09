%global debug_package %{nil}

Name:           dci-ui
Version:        0.1.2
Release:        2.VERS%{?dist}

Summary:        DCI UI static files
License:        ASL 2.0

URL:            https://github.com/redhat-cip/dci-ui
Source0:        dci-ui-%{version}.tar.gz

%if 0%{?rhel} && 0%{?rhel} < 8
BuildRequires:  rh-nodejs12
%else
BuildRequires:  /usr/bin/npm
%endif

%description
DCI UI static files

%prep -a
%setup -qc

%build
%if 0%{?rhel} && 0%{?rhel} < 8
scl enable rh-nodejs12 "npm install"
scl enable rh-nodejs12 "npm run build"
%else
npm install
npm run build
%endif

%install
install -d -m0755 %{buildroot}/srv/www/dci-ui
install -d -m0755 %{buildroot}/etc/dci-ui
cp -r build/* %{buildroot}/srv/www/dci-ui

%files
/srv/www/dci-ui/*
%config(noreplace) /srv/www/dci-ui/config.json

%changelog
* Wed Dec 09 2020 Guillaume Vincent <gvincent@redhat.com> 0.1.2-1
- Use LTS nodejs version 12 from software collection

* Wed Jun  3 2020 Haïkel Guémar <hguemar@fedoraproject.org> - 0.1.1-2
- Use npm from node modules on EL8

* Thu May 23 2019 Guillaume Vincent <gvincent@redhat.com> 0.1.1-1
- Use LTS nodejs version 10 from software collection

* Tue Aug 7 2018 Guillaume Vincent <gvincent@redhat.com> 0.1.0-1
- Migration from AngularJS to React

* Fri Jun 23 2017 Guillaume Vincent <gvincent@redhat.com> 0.0-2
- Use npm script instead of gulp to build the application

* Mon Jan 11 2016 Yanis Guenane <yguenane@redhat.com> 0.0-1
- Initial commit
