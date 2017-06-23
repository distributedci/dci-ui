%global debug_package %{nil}

Name:           dci-ui
Version:        0.0.VERS
Release:        1%{?dist}

Summary:        DCI UI static files
License:        ASL 2.0

URL:            https://github.com/redhat-cip/dci-ui
Source0:        dci-ui-%{version}.tar.gz

%if 0%{?rhel}
BuildRequires:  epel-release
%endif
BuildRequires:  nodejs
BuildRequires:  npm
BuildRequires:  tar
BuildRequires:  bzip2
BuildRequires:  git

%description
DCI UI static files

%prep -a
%setup -qc

%build
npm install
npm run build

%install
install -d -m0755 %{buildroot}/srv/www/dci-ui
install -d -m0755 %{buildroot}/etc/dci-ui
cp -r static/* %{buildroot}/srv/www/dci-ui
ln -sf /srv/www/dci-ui/config.js %{buildroot}/etc/dci-ui/config.js

%files
/srv/www/dci-ui/*
%config(noreplace) /etc/dci-ui/config.js

%changelog
* Fri Jun 23 2017 Guillaume Vincent <gvincent@redhat.com> 0.0-2
- Use npm script instead of gulp to build the application

* Mon Jan 11 2016 Yanis Guenane <yguenane@redhat.com> 0.0-1
- Initial commit
